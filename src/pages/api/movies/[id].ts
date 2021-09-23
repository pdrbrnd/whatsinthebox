import { withSentry, captureException } from '@sentry/nextjs'
import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const where = {
    _and: [
      {
        start_time: {
          _gte: dayjs().subtract(7, 'days').format('YYYY-MM-DD HH:mm'),
        },
      },
      { start_time: { _lte: dayjs().format('YYYY-MM-DD HH:mm') } },
    ],
  } as const

  if (!id || typeof id !== 'string') {
    return res.status(401).json({ error: 'Missing ID' })
  }

  try {
    const { data, errors } = await fetchGraphql<
      {
        movies_by_pk: Record<string, unknown>
      },
      { imdbId: string; where: typeof where }
    >({
      query: `
      query getMovie($where: schedules_bool_exp!, $imdbId: String!) {
        movies_by_pk(
          imdb_id: $imdbId
          ) {
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
          schedules(where: $where) {
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
        where,
      },
    })

    if (!data || errors) {
      throw {
        message: `Could not fetch movie ${id}`,
        errors: errors || [],
      }
    }

    res.status(200).json({ details: data ? data.movies_by_pk : null })
  } catch (error) {
    captureException(error)
    res.status(401).json({ error })
  }
})
