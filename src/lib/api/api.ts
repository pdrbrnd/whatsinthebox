import { Channel, Program, Movie, OmdbResponse } from './types'

const CHANNELS_ENDPOINT =
  'https://web.ott-red.vodafone.pt/ott3_webapp/v1.5/channels'
const GRID_ENDPOINT =
  'https://web.ott-red.vodafone.pt/ott3_webapp/v1.5/programs/grids'
const CHANNEL_TARGET_CATEGORY = 'Filmes e Séries'

const GRAPHQL_ENDPOINT = 'https://whatsinthebox.hasura.app/v1/graphql'
const HASURA_SECRET = process.env.HASURA_SECRET || ''
const OMDB_API_KEY = process.env.OMDB_API_KEY

// use with /<first_char>/<movie_title_lowercase_with_underscores>.json
// e.g.: https://v2.sg.media-imdb.com/suggestion/o/o_padrinho.json
const IMDB_SUGGESTIONS_ENDPOINT = 'https://v2.sg.media-imdb.com/suggestion'

function getChannelGridEndpoint(channelId: string, dayOffset = 0) {
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
  const data: { d?: { id: string }[] } = await res.json()

  return data.d && data.d[0] ? data.d[0].id : null
}

async function fetchMovieDetailsId(imdbId: string) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': HASURA_SECRET,
    },
    body: JSON.stringify({
      query: `
        query getMovieDetailsId($imdbId: String!) {
          movie_details_by_pk(imdb_id: $imdbId) {
            id
          }
        }
      `,
      variables: {
        imdbId: imdbId,
      },
    }),
  })
  const { data }: { data: { movie_details_by_pk: null | { id: number } } } =
    await res.json()

  // TODO: if details are too old (more than one month, fetch OMDB api and update)
  if (data.movie_details_by_pk?.id) return data.movie_details_by_pk.id

  const detailsRes = await fetch(
    `https://omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
  )
  const details: OmdbResponse = await detailsRes.json()

  const imdb = details.Ratings.find(
    (r) => r.Source === 'Internet Movie Database'
  )
  const imdbRating = imdb ? imdb.Value.split('/')[0] : 'n/a'

  const rotten = details.Ratings.find((r) => r.Source === 'Rotten Tomatoes')
  const rottenRating = rotten ? rotten.Value : 'N/A'

  const meta = details.Ratings.find((r) => r.Source === 'Metacritic')
  const metaRating = meta ? meta.Value.split('/')[0] : 'N/A'

  const insertRes = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': HASURA_SECRET,
    },
    body: JSON.stringify({
      query: `
        mutation insertMovieDetails(
          $original: json!,
          $actors: String!,
          $country: String!,
          $director: String!,
          $genre: String!,
          $imdb_id: String!,
          $language: String!,
          $plot: String!,
          $poster: String!,
          $rating_imdb: String!,
          $rating_metascore: String!,
          $rating_rotten_tomatoes: String!,
          $runtime: String!,
          $title: String!,
          $writer: String!,
          $year: String!,
        ) {
          insert_movie_details_one(
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
              constraint: movie_details_imdbId_key,
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
        rating_imdb: details.imdbRating || imdbRating,
        rating_metascore: details.Metascore || metaRating,
        rating_rotten_tomatoes: rottenRating,
        runtime: details.Runtime,
        title: details.Title,
        writer: details.Writer,
        year: details.Year,
      },
    }),
  })

  const insertData: { data: { insert_movie_details_one: { id: number } } } =
    await insertRes.json()

  return insertData.data.insert_movie_details_one.id
}

const detailsCache = new Map()
async function getMovieDetailsId(imdbId: string) {
  if (detailsCache.has(imdbId)) return detailsCache.get(imdbId)

  const detailsId = await fetchMovieDetailsId(imdbId)
  detailsCache.set(imdbId, detailsId)

  return detailsCache.get(imdbId)
}

export async function getChannels(): Promise<Channel[]> {
  const res = await fetch(CHANNELS_ENDPOINT)
  const { data }: { data: (Channel & Record<string, unknown>)[] } =
    await res.json()

  // We only care for channels with a certain category
  return data.filter((channel) => channel.category === CHANNEL_TARGET_CATEGORY)
}

export async function getChannelMovies(channel: Channel): Promise<Movie[]> {
  const res = await fetch(getChannelGridEndpoint(channel.id))
  const { data }: { data: Program[] } = await res.json()

  const movies = await Promise.all(
    data
      .filter((program) => !('series' in program))
      .map(async (movie) => {
        const imdbId = await getImdbId(movie.title)
        const detailsId = imdbId ? await getMovieDetailsId(imdbId) : null

        return {
          title: movie.title,
          description: movie.description,
          startTime: movie.startTime,
          endTime: movie.endTime,
          duration: movie.duration,
          imdbId,
          detailsId,
        }
      })
  )

  return movies
}
