import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchGraphql } from 'lib/graphql'
import { codeMiddleware, runMiddleware } from 'lib/middleware'
import { getImdbId } from 'lib/api/imdb'
import { processImdbId } from 'lib/api/details'

interface Program {
  title: string
  description: string
  startTime: string
  endTime: string
  duration: number
  series?: Record<string, unknown>
}

interface MovieSchedule extends Omit<Program, 'series'> {
  imdbId: string | null
  movieId: number | null
}

const GRID_ENDPOINT =
  'https://web.ott-red.vodafone.pt/ott3_webapp/v1.5/programs/grids'

function getChannelGridEndpoint(channelId: string, dayOffset = -1) {
  return `${GRID_ENDPOINT}/${encodeURI(channelId)}/${dayOffset.toString()}`
}

async function insertSchedules(schedules: MovieSchedule[], channelId: number) {
  const { data, errors } = await fetchGraphql<
    {
      insert_schedules: {
        returning: {
          id: number
          title: string
          start_time: string
          channel_id: number
          imdb_id: string
          movie_id: number
        }[]
      }
    },
    {
      schedules: {
        title: string
        plot: string
        start_time: string
        end_time: string
        duration: number
        channel_id: number
        imdb_id: string | null
        movie_id: number | null
      }[]
    }
  >({
    query: `
      mutation insertSchedules($schedules: [schedules_insert_input!]!) {
        insert_schedules(
          objects: $schedules,
          on_conflict: {
            constraint: schedules_start_time_channel_id_key
            update_columns: [channel_id, start_time, imdb_id, movie_id]
          }
        ) {
          returning {
            id
            title
            start_time
            channel_id
            imdb_id
            movie_id
          }
        }
      }
    `,
    variables: {
      schedules: schedules.map((schedule) => ({
        channel_id: channelId,
        title: schedule.title,
        plot: schedule.description,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        duration: schedule.duration,
        imdb_id: schedule.imdbId,
        movie_id: schedule.movieId,
      })),
    },
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw {
      message: `Could not insert scheduled movies for channel ${channelId}`,
      errors: errors || [],
    }
  }

  return data.insert_schedules.returning
}

async function getChannelExternalId(id: number) {
  const { data, errors } = await fetchGraphql<{
    channels_by_pk: null | { external_id: string }
  }>({
    query: `
      query getChannelExternalId($id: Int!) {
        channels_by_pk(id: $id) {
          external_id
        }
      }
    `,
    variables: {
      id,
    },
    includeAdminSecret: true,
  })

  if (!data || !data.channels_by_pk || errors) {
    throw {
      message: `Could not query external ID for channel ${id}`,
      errors: errors || [],
    }
  }

  return data.channels_by_pk.external_id
}

async function getNextQueuedChannel() {
  const { data, errors } = await fetchGraphql<{
    queued_channels: { id: number; channel_id: number; day_offset: number }[]
  }>({
    query: `
      query getNextQueuedChannel {
        queued_channels(
          limit: 1
          where: {
            is_complete: { _eq: false }
          }
        ) {
          id
          channel_id
          day_offset
        }
      }
    `,
    includeAdminSecret: true,
  })

  if (!data || errors) {
    throw {
      message: `Could not get the next queued channel`,
      errors: errors || [],
    }
  }

  if (!data.queued_channels[0]) return null

  return data.queued_channels[0]
}

async function setQueuedChannelAsComplete(queueId: number) {
  await fetchGraphql<
    { update_queued_channels_by_pk: { id: number } },
    { id: number }
  >({
    query: `
      mutation completeQueue($id: Int!) {
        update_queued_channels_by_pk(
          _set: {
            is_complete: true
          }, 
          pk_columns: {
            id: $id
          }
        ) {
          id
        }
      }
    `,
    variables: {
      id: queueId,
    },
    includeAdminSecret: true,
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, codeMiddleware)

  try {
    const next = await getNextQueuedChannel()

    if (next === null) {
      return res.status(200).json({ message: 'No incomplete items in queue' })
    }

    const { channel_id: channelId, id: queueId, day_offset: dayOffset } = next

    const externalId = await getChannelExternalId(channelId)
    const grid = await fetch(getChannelGridEndpoint(externalId, dayOffset))
    const { data }: { data: Program[] } = await grid.json()

    let scheduledMovies = await Promise.all(
      data
        .filter((program) => !('series' in program))
        .map(async (movie) => {
          const imdbId = await getImdbId(movie.title)
          const movieId = imdbId ? await processImdbId(imdbId) : null

          return {
            title: movie.title,
            description: movie.description,
            startTime: movie.startTime,
            endTime: movie.endTime,
            duration: movie.duration,
            imdbId,
            movieId,
          }
        })
    )
    /**
     * Having movies with no imdbID doesn't make much sense.
     * Filter out movies where we didn't find the imdbID.
     * */
    scheduledMovies = scheduledMovies.filter(
      (movie) => !!movie.imdbId && !!movie.movieId
    )

    const inserted = await insertSchedules(scheduledMovies, channelId)
    await setQueuedChannelAsComplete(queueId)

    res.status(200).json({ status: 'ok', data: inserted })
  } catch (error) {
    res.status(422).json({ error })
  }
}
