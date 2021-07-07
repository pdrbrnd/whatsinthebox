import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await fetchGraphql<{
      channels: {
        id: number
        is_premium: boolean
        name: string
      }[]
    }>({
      query: `
        query getChannels {
          channels {
            id
            is_premium
            name
          }
        }
      `,
    })

    res.status(200).json({ channels: data ? data.channels : [] })
  } catch (error) {
    res.status(401).json({ error })
  }
}
