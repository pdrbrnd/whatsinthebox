import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { offset, genre, minYear, maxYear, channelsBlacklist, search, sort } =
    req.body

  let order_by: Record<string, string> = {
    rating_imdb: 'desc_nulls_last',
  }
  if (sort && sort === 'rotten') {
    order_by = {
      rating_rotten_tomatoes: 'desc_nulls_last',
    }
  }

  const filters = []
  if (genre && typeof genre === 'string') {
    filters.push({ genre: { _ilike: `%${genre}%` } })
  }
  if (minYear && typeof minYear === 'string') {
    filters.push({ year: { _gte: minYear } })
  }
  if (maxYear && typeof maxYear === 'string') {
    filters.push({ year: { _gte: minYear } })
  }
  if (
    channelsBlacklist &&
    Array.isArray(channelsBlacklist) &&
    channelsBlacklist.every((c) => typeof c === 'string')
  ) {
    filters.push({
      schedules: {
        channel: {
          id: {
            _nin: channelsBlacklist,
          },
        },
      },
    })
  }
  if (search && typeof search === 'string') {
    filters.push({
      _or: [
        { title: { _ilike: search } },
        { actors: { _ilike: search } },
        { director: { _ilike: search } },
        { writer: { _ilike: search } },
      ],
    })
  }

  try {
    const { data } = await fetchGraphql<{
      movies: {
        id: number
        poster: string
        year: string
        title: string
        rating_imdb: string | null
        rating_rotten_tomatoes: string | null
      }[]
    }>({
      query: `
        query getMovies($where: movies_bool_exp!, $order: [movies_order_by!]!, $offset: Int = 0) {
          movies(
            limit: 24,
            offset: $offset,
            where: $where,
            order_by: $order,
          ) {
            id
            poster
            year
            title
            rating_imdb
            rating_rotten_tomatoes
          }
        }
      `,
      variables: {
        offset: offset ? Number(offset) : 0,
        order: order_by,
        where: {
          _and: filters,
          schedules: {
            start_time: {
              _gte: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
            },
          },
        },
      },
    })

    res.status(200).json({ movies: data ? data.movies : [] })
  } catch (error) {
    res.status(401).json({ error })
  }
}
