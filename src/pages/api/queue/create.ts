import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'
import { codeMiddleware, runMiddleware } from 'lib/middleware'

async function getChannelIds() {
  const { data, errors } = await fetchGraphql<{ channels: { id: number }[] }>({
    query: `
      query getChannels {
        channels {
          id
        }
      }
    `,
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw { message: 'Could not query channels', errors: errors || [] }
  }

  return data.channels.map((channel) => channel.id)
}

async function queueChannels(ids: number[], offset?: number | null) {
  const { data, errors } = await fetchGraphql<
    { insert_queued_channels: { returning: { id: number }[] } },
    { channels: { channel_id: number; day_offset?: number }[] }
  >({
    query: `
      mutation insertQueuedChannels($channels: [queued_channels_insert_input!]!) {
        insert_queued_channels(
          objects: $channels, 
          on_conflict: {
            constraint: queued_channels_day_channel_id_key
            update_columns: [channel_id, day]
          }
        ) {
          returning {
            id
          }
        }
      }
    `,
    variables: {
      channels: ids.map((channel_id) =>
        offset ? { channel_id, day_offset: offset } : { channel_id }
      ),
    },
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw { message: 'Could not add channels to queue', errors: errors || [] }
  }

  return data.insert_queued_channels.returning
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, codeMiddleware)

  try {
    const ids = await getChannelIds()
    const offset = req.body?.payload?.offset
      ? Number(req.body?.payload?.offset)
      : null
    await queueChannels(ids, offset)

    res.status(200).json({ message: 'ok' })
  } catch (error) {
    res.status(422).json({ error })
  }
}
