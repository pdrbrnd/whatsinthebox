import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(401).json({ error: 'Missing ID' })
  }

  try {
    const { data, errors } = await fetchGraphql<
      {
        movies_by_pk: Record<string, unknown>
      },
      { imdbId: string }
    >({
      query: `
      query getMovie($imdbId: String!) {
        movies_by_pk(imdb_id: $imdbId) {
          title
          actors
          country
          director
          genre
          id
          imdb_id
          language
          plot
          poster
          rating_imdb
          rating_rotten_tomatoes
          runtime
          year
          writer
          schedules {
            start_time
            title
            channel {
              name
            }
          }
        }
      }
      `,
      variables: {
        imdbId: id,
      },
    })

    if (!data || errors) {
      throw {
        message: `Could not fetch movie ${id}`,
        errors: errors || [],
      }
    }

    res.status(200).json({ details: data ? data.movies_by_pk : [] })
  } catch (error) {
    res.status(401).json({ error })
  }
}
