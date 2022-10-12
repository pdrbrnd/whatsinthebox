import { captureException } from '@sentry/nextjs'
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
    {
      insert_queued_channels: {
        returning: {
          id: number
          channel_id: number
          day: string
          day_offset: number
        }[]
      }
    },
    {
      channels: {
        channel_id: number
        day_offset?: number
        is_complete: boolean
      }[]
    }
  >({
    query: `
      mutation insertQueuedChannels($channels: [queued_channels_insert_input!]!) {
        insert_queued_channels(
          objects: $channels, 
          on_conflict: {
            constraint: queued_channels_day_channel_id_day_offset_key
            update_columns: [channel_id, day, day_offset, is_complete]
          }
        ) {
          returning {
            id
            channel_id
            day
            day_offset
          }
        }
      }
    `,
    variables: {
      channels: ids.map((channel_id) =>
        typeof offset === 'number'
          ? { channel_id, day_offset: offset, is_complete: false }
          : { channel_id, is_complete: false }
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
    const offset =
      typeof req.body?.payload?.offset === 'number'
        ? req.body.payload.offset
        : null
    const queued = await queueChannels(ids, offset)

    res.status(200).json({ status: 'ok', data: queued })
  } catch (error) {
    captureException(error)
    res.status(422).json({ error })
  }
}
