import { withSentry, captureException } from '@sentry/nextjs'
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

/**
  Nacional
  Desporto
  Generalistas
  Entretenimento
  Infantil
  Filmes e Séries
  Música
  Documentários
  Notícias
 */
const CHANNEL_TARGET_CATEGORIES = ['Filmes e Séries']
const CHANNEL_ID_WHITELIST = ['RTP 1', 'RTP 2', 'SIC', 'TVI']

async function getChannels(): Promise<Channel[]> {
  const res = await fetch(CHANNELS_ENDPOINT)
  const { data }: { data: (Channel & Record<string, unknown>)[] } =
    await res.json()

  return (
    data
      // We only care for channels with a certain category
      .filter(
        (channel) =>
          (CHANNEL_TARGET_CATEGORIES.includes(channel.category) ||
            CHANNEL_ID_WHITELIST.includes(channel.id)) &&
          channel.name !== 'TV Series'
      )
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
      insert_channels: { returning: { id: number; name: string }[] }
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
            name
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

  return data.insert_channels.returning
}

export default withSentry(async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, codeMiddleware)

  try {
    const channels = await getChannels()
    const inserted = await insertChannels(channels)

    res.status(200).json({ status: 'ok', data: inserted })
  } catch (error) {
    captureException(error)
    res.status(422).json({ error })
  }
})
