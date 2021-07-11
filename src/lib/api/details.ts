import dayjs from 'dayjs'

import { fetchGraphql } from 'lib/graphql'

const OMDB_API_KEY = process.env.OMDB_API_KEY

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

export async function processImdbId(imdbId: string) {
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
