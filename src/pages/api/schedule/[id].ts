import type { NextApiRequest, NextApiResponse } from 'next'

import { codeMiddleware, runMiddleware } from 'lib/middleware'
import { fetchGraphql } from 'lib/graphql'
import { getImdbId } from 'lib/api/imdb'
import { processImdbId } from 'lib/api/details'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, codeMiddleware)

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(401).json({ error: 'Missing ID' })
  }

  try {
    const { data, errors } = await fetchGraphql<
      {
        schedules_by_pk: null | { id: number; title: string }
      },
      { id: number }
    >({
      query: `
        query getSchedule($id: Int!) {
          schedules_by_pk(id: $id) {
            id
            title
          }
        }
      `,
      variables: {
        id: Number(id),
      },
    })

    if (!data || !data.schedules_by_pk || errors) {
      throw new Error(`Failed fetching schedule ${id}`)
    }

    const imdbId = await getImdbId(data.schedules_by_pk.title)
    const movieId = imdbId ? await processImdbId(imdbId) : null

    if (!imdbId || !movieId) {
      throw new Error(`Failed processing schedule ${id}`)
    }

    const update = await fetchGraphql<
      { update_schedules: { affected_rows: number } },
      { id: number; imdbId: string; movieId: number }
    >({
      query: `
        mutation updateScheduleDetails($id: Int!, $imdbId: String!, $movieId: Int!) {
          update_schedules(where: { id: { _eq: $id } }, _set: { imdb_id: $imdbId, movie_id: $movieId }) {
            affected_rows
          }
        }
      `,
      variables: {
        id: Number(id),
        imdbId,
        movieId,
      },
      includeAdminSecret: true,
    })

    res.status(200).json({ status: 'ok', data: update })
  } catch (error) {
    res.status(422).json({ error })
  }
}
