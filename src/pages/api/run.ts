import type { NextApiRequest, NextApiResponse } from 'next'

import { getChannelMovies, getChannels } from 'lib/api/api'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const channels = await getChannels()

  const programming = await Promise.all(
    channels.slice(0, 1).map(async (channel) => {
      const movies = await getChannelMovies(channel)

      return {
        channel: {
          id: channel.id,
          name: channel.name,
          isPremium: channel.isPremium,
        },
        movies,
      }
    })
  )

  res.status(200).json({ data: programming })
}
