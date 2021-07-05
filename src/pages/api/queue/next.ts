import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'
import { codeMiddleware, runMiddleware } from 'lib/middleware'

interface Program {
  title: string
  description: string
  startTime: string
  endTime: string
  duration: number
  series?: Record<string, unknown>
}

interface MovieSchedule extends Omit<Program, 'series'> {
  imdbId: string | null
  movieId: number | null
}

interface OmdbResponse {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings?: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: 'True'
}

const GRID_ENDPOINT =
  'https://web.ott-red.vodafone.pt/ott3_webapp/v1.5/programs/grids'
const OMDB_API_KEY = process.env.OMDB_API_KEY
// use with /<first_char>/<movie_title_lowercase_with_underscores>.json
// e.g.: https://v2.sg.media-imdb.com/suggestion/o/o_padrinho.json
const IMDB_SUGGESTIONS_ENDPOINT = 'https://v2.sg.media-imdb.com/suggestion'

function getChannelGridEndpoint(channelId: string, dayOffset = -1) {
  return `${GRID_ENDPOINT}/${encodeURI(channelId)}/${dayOffset.toString()}`
}

async function getImdbId(movieTitle: string): Promise<string | null> {
  const url =
    IMDB_SUGGESTIONS_ENDPOINT +
    `/${movieTitle.charAt(0).toLowerCase()}/` +
    movieTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(' ', '_') +
    '.json'
  const res = await fetch(url)
  const data: { d?: { id: string; q: string }[] } = await res.json()

  if (!data.d) return null

  const movieId = data.d.find(
    (item) => item.id.startsWith('tt') && item.q === 'feature'
  )?.id

  return movieId || null
}

function getRating(
  ratings: OmdbResponse['Ratings'],
  source: string,
  transform: (value: string) => string = (v) => v
) {
  const target = ratings?.find((rating) => rating.Source === source)
  const rating: string | null =
    target && target.Value !== 'N/A' ? transform(target.Value) : null

  return rating
}

async function insertMovieDetails(imdbId: string) {
  const res = await fetch(
    `https://omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
  )
  const details: OmdbResponse | { Response: 'False' } = await res.json()

  if (details.Response === 'False') {
    throw `No details available for ${imdbId}`
  }

  const imdbRating = getRating(
    details.Ratings,
    'Internet Movie Database',
    (value) => value.split('/')[0]
  )
  const rottenRating = getRating(details.Ratings, 'Rotten Tomatoes')
  const metaRating = getRating(
    details.Ratings,
    'Metacritic',
    (value) => value.split('/')[0]
  )

  const { data, errors } = await fetchGraphql<{
    insert_movies_one: { id: number }
  }>({
    query: `
    mutation insertMovies(
      $original: json!,
      $actors: String!,
      $country: String!,
      $director: String!,
      $genre: String!,
      $imdb_id: String!,
      $language: String!,
      $plot: String!,
      $poster: String!,
      $rating_imdb: String,
      $rating_metascore: String,
      $rating_rotten_tomatoes: String,
      $runtime: String!,
      $title: String!,
      $writer: String!,
      $year: String!,
    ) {
      insert_movies_one(
        object: {
          original_response: $original,
          actors: $actors,
          country: $country,
          director: $director,
          genre: $genre,
          imdb_id: $imdb_id,
          language: $language,
          plot: $plot,
          poster: $poster,
          rating_imdb: $rating_imdb,
          rating_metascore: $rating_metascore,
          rating_rotten_tomatoes: $rating_rotten_tomatoes,
          runtime: $runtime,
          title: $title,
          writer: $writer,
          year: $year,
        },
        on_conflict: {
          constraint: movies_imdb_id_key,
          update_columns: [imdb_id]
        }
      ) {
        id
      }
    }
  `,
    variables: {
      original: details,
      actors: details.Actors,
      country: details.Country,
      director: details.Director,
      genre: details.Genre,
      imdb_id: details.imdbID,
      language: details.Language,
      plot: details.Plot,
      poster: details.Poster,
      rating_imdb:
        details.imdbRating && details.imdbRating !== 'N/A'
          ? details.imdbRating
          : imdbRating,
      rating_metascore:
        details.Metascore && details.Metascore !== 'N/A'
          ? details.Metascore
          : metaRating,
      rating_rotten_tomatoes: rottenRating,
      runtime: details.Runtime,
      title: details.Title,
      writer: details.Writer,
      year: details.Year,
    },
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw { message: 'Could not insert movie details', errors: errors || [] }
  }

  return data.insert_movies_one.id
}

async function getMovieId(imdbId: string) {
  try {
    const { data, errors } = await fetchGraphql<{
      movie_details_by_pk: null | { id: number; updated_at: string }
    }>({
      query: `
          query getMoviesId($imdbId: String!) {
            movies_by_pk(imdb_id: $imdbId) {
              id
              updated_at
            }
          }
        `,
      variables: {
        imdbId: imdbId,
      },
      includeAdminSecret: true,
    })

    if (!data || errors) {
      throw {
        message: 'Could not fetch movie details id',
        errors: errors || [],
      }
    }

    if (!data.movie_details_by_pk?.id) return await insertMovieDetails(imdbId)

    // details are more than 30 days old
    if (
      dayjs().isAfter(
        dayjs(data.movie_details_by_pk.updated_at).add(30, 'days')
      )
    ) {
      return await insertMovieDetails(imdbId)
    }

    return data.movie_details_by_pk.id
  } catch (error) {
    return null
  }
}

async function insertSchedules(schedules: MovieSchedule[], channelId: number) {
  const { data, errors } = await fetchGraphql<
    {
      insert_schedules: { returning: { id: number }[] }
    },
    {
      schedules: {
        title: string
        plot: string
        start_time: string
        end_time: string
        duration: number
        channel_id: number
        imdb_id: string | null
        movie_id: number | null
      }[]
    }
  >({
    query: `
      mutation insertSchedules($schedules: [schedules_insert_input!]!) {
        insert_schedules(
          objects: $schedules,
          on_conflict: {
            constraint: schedules_start_time_channel_id_key
            update_columns: [channel_id, start_time, imdb_id, movie_id]
          }
        ) {
          returning {
            id
          }
        }
      }
    `,
    variables: {
      schedules: schedules.map((schedule) => ({
        channel_id: channelId,
        title: schedule.title,
        plot: schedule.description,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        duration: schedule.duration,
        imdb_id: schedule.imdbId,
        movie_id: schedule.movieId,
      })),
    },
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw {
      message: `Could not insert scheduled movies for channel ${channelId}`,
      errors: errors || [],
    }
  }

  return data.insert_schedules.returning.map((item) => item.id)
}

async function getChannelExternalId(id: number) {
  const { data, errors } = await fetchGraphql<{
    channels_by_pk: null | { external_id: string }
  }>({
    query: `
      query getChannelExternalId($id: Int!) {
        channels_by_pk(id: $id) {
          external_id
        }
      }
    `,
    variables: {
      id,
    },
    includeAdminSecret: true,
  })

  if (!data || !data.channels_by_pk || errors) {
    throw {
      message: `Could not query external ID for channel ${id}`,
      errors: errors || [],
    }
  }

  return data.channels_by_pk.external_id
}

async function getNextQueuedChannel() {
  const { data, errors } = await fetchGraphql<{
    queued_channels: { id: number; channel_id: number; day_offset: number }[]
  }>({
    query: `
      query getNextQueuedChannel {
        queued_channels(
          limit: 1
          where: {
            is_complete: { _eq: false }
          }
        ) {
          id
          channel_id
          day_offset
        }
      }
    `,
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw {
      message: `Could not get the next queued channel`,
      errors: errors || [],
    }
  }

  if (!data.queued_channels[0]) return null

  return data.queued_channels[0]
}

async function setQueuedChannelAsComplete(queueId: number) {
  await fetchGraphql<
    { update_queued_channels_by_pk: { id: number } },
    { id: number }
  >({
    query: `
      mutation completeQueue($id: Int!) {
        update_queued_channels_by_pk(
          _set: {
            is_complete: true
          }, 
          pk_columns: {
            id: $id
          }
        ) {
          id
        }
      }
    `,
    variables: {
      id: queueId,
    },
    includeAdminSecret: true,
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, codeMiddleware)

  try {
    const next = await getNextQueuedChannel()

    if (next === null) {
      return res.status(200).json({ message: 'No incomplete items in queue' })
    }

    const { channel_id: channelId, id: queueId, day_offset: dayOffset } = next

    const externalId = await getChannelExternalId(channelId)
    const grid = await fetch(getChannelGridEndpoint(externalId, dayOffset))
    const { data }: { data: Program[] } = await grid.json()

    let scheduledMovies = await Promise.all(
      data
        .filter((program) => !('series' in program))
        .map(async (movie) => {
          const imdbId = await getImdbId(movie.title)
          const movieId = imdbId ? await getMovieId(imdbId) : null

          return {
            title: movie.title,
            description: movie.description,
            startTime: movie.startTime,
            endTime: movie.endTime,
            duration: movie.duration,
            imdbId,
            movieId,
          }
        })
    )
    /**
     * Having movies with no imdbID doesn't make much sense.
     * Filter out movies where we didn't find the imdbID.
     * */
    scheduledMovies = scheduledMovies.filter(
      (movie) => !!movie.imdbId && !!movie.movieId
    )

    await insertSchedules(scheduledMovies, channelId)
    await setQueuedChannelAsComplete(queueId)

    res.status(200).json({ message: 'ok' })
  } catch (error) {
    res.status(422).json({ error })
  }
}
