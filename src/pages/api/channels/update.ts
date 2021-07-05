import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'
import { codeMiddleware, runMiddleware } from 'lib/middleware'

interface Channel {
  id: string
  name: string
  category: string
  isPremium: boolean
}

const CHANNELS_ENDPOINT =
  'https://web.ott-red.vodafone.pt/ott3_webapp/v1.5/channels'
const CHANNEL_TARGET_CATEGORY = 'Filmes e Séries'

async function getChannels(): Promise<Channel[]> {
  const res = await fetch(CHANNELS_ENDPOINT)
  const { data }: { data: (Channel & Record<string, unknown>)[] } =
    await res.json()

  return (
    data
      // We only care for channels with a certain category
      .filter((channel) => channel.category === CHANNEL_TARGET_CATEGORY)
      // Filter HD channels: the programming is the same
      .filter((channel) => !/HD$/g.test(channel.id))
      // Remove HD and SD from the channel name
      .map((channel) => ({
        ...channel,
        name: channel.name.replace(/\s(?:SD|HD)$/g, ''),
      }))
  )
}

async function insertChannels(channels: Channel[]) {
  const { data, errors } = await fetchGraphql<
    {
      insert_channels: { returning: { id: number }[] }
    },
    {
      channels: { name: string; external_id: string; is_premium: boolean }[]
    }
  >({
    query: `
      mutation insertChannels($channels: [channels_insert_input!]!) {
        insert_channels(
          objects: $channels, 
          on_conflict: {
            constraint: channels_external_id_key
            update_columns: [external_id, name]
          }
        ) {
          returning {
            id
          }
        }
      }
    `,
    variables: {
      channels: channels.map((channel) => ({
        name: channel.name,
        external_id: channel.id,
        is_premium: channel.isPremium,
      })),
    },
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw { message: 'Could not insert channels', errors: errors || [] }
  }

  return data.insert_channels.returning.map((item) => item.id)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, codeMiddleware)

  try {
    const channels = await getChannels()
    await insertChannels(channels)

    res.status(200).json({ message: 'ok' })
  } catch (error) {
    res.status(422).json({ error })
  }
}