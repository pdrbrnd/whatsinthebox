import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { useRouter } from 'next/dist/client/router'
import ContentLoader from 'react-content-loader'
import { usePlausible } from 'next-plausible'
import { useEffect } from 'react'

import { styled } from 'lib/style'
import {
  Box,
  Stack,
  Button,
  Text,
  CloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
} from 'components/UI'
import { External } from 'components/Icons'
import { Rating } from 'components/Rating'
import { useTranslations } from 'lib/i18n'
import { PlausibleEvents } from 'common/constants'

type DetailsData = {
  details: null | {
    id: string
    imdb_id: string
    year: string
    title: string
    plot: string | null
    actors: string | null
    country: string | null
    director: string | null
    genre: string | null
    language: string | null
    poster: string | null
    rating_imdb: string | null
    rating_rotten_tomatoes: string | null
    runtime: string | null
    writer: string | null
    schedules: {
      title: string
      start_time: string
      channel: {
        name: string
      }
    }[]
  }
}

export const MovieDetails = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()
  const {
    query: { id, ...rest },
    push,
  } = useRouter()

  const { data, isLoading, isError } = useQuery<DetailsData>(
    `movie-${id}`,
    async () => {
      const res = await fetch(`/api/movies/${id}`)

      if (!res.ok) throw new Error('Could not fetch movie')

      return res.json()
    },
    {
      enabled: typeof id === 'string',
    }
  )

  useEffect(() => {
    if (!isLoading && (isError || !data?.details)) push({ query: rest })
  }, [isError, push, rest, isLoading, data?.details])

  if (isLoading || !data) {
    return (
      <LoadingDetails
        onClose={() => push({ query: rest }, undefined, { shallow: true })}
      />
    )
  }

  if (!data.details) return null

  const {
    details: {
      imdb_id,
      year,
      title,
      plot,
      actors,
      country,
      director,
      genre,
      language,
      rating_imdb,
      rating_rotten_tomatoes,
      runtime,
      writer,
      schedules,
    },
  } = data

  return (
    <Wrapper>
      <Header>
        {rating_imdb || rating_rotten_tomatoes ? (
          <Rating imdb={rating_imdb} rotten={rating_rotten_tomatoes} />
        ) : (
          <div />
        )}
        <CloseButton onClick={() => push({ query: rest })} />
      </Header>

      <Inner>
        <Block>
          {year && <Text variant="tiny">{year}</Text>}
          {title && (
            <Text variant="title" css={{ mt: '$4', mb: '$8' }}>
              {title}
            </Text>
          )}
          {plot && <Text>{plot}</Text>}
        </Block>

        <DetailsSchedules schedules={schedules} />

        <Block>
          <Stack
            direction="vertical"
            spacing="24"
            css={{ alignItems: 'flex-start' }}
          >
            {genre && (
              <Detail label={t('genre')}>
                <Stack css={{ mt: '$8' }} spacing="4">
                  {genre.split(',').map((gen, i) => (
                    <Tag key={i}>{gen}</Tag>
                  ))}
                </Stack>
              </Detail>
            )}
            {[
              { label: t('runtime'), data: runtime },
              { label: t('director'), data: director },
              { label: t('actors'), data: actors },
              { label: t('writer'), data: writer },
              { label: t('country'), data: country },
              { label: t('language'), data: language },
            ].map((item, i) =>
              item.data ? (
                <Detail label={item.label} key={i}>
                  <Text variant="small">{item.data}</Text>
                </Detail>
              ) : null
            )}
          </Stack>
          <Stack css={{ mt: '$40' }}>
            <Button
              css={{ display: 'inline-flex' }}
              as="a"
              href={`https://imdb.com/title/${imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                plausible(PlausibleEvents.OpenImdb, {
                  props: {
                    title: title,
                    href: `https://imdb.com/title/${imdb_id}`,
                  },
                })
              }}
            >
              <Stack spacing="16">
                <span>{t('openImdb')}</span>
                <Box css={{ color: '$secondary' }}>
                  <External />
                </Box>
              </Stack>
            </Button>
          </Stack>
        </Block>
      </Inner>
    </Wrapper>
  )
}

const LoadingDetails = ({ onClose }: { onClose: () => void }) => {
  return (
    <Wrapper>
      <Header>
        <ContentLoader
          uniqueKey="detailTopLoader"
          width={100}
          height={14}
          backgroundColor="hsla(220, 10%, 50%, 0.1)"
          foregroundColor="hsla(220, 10%, 50%, 0.05)"
        >
          <rect x="0" y="0" width="100" height="14" />
        </ContentLoader>
        <CloseButton onClick={() => onClose()} />
      </Header>
      <Inner>
        <Block>
          <ContentLoader
            uniqueKey="detailContentLoader"
            width={500}
            height={170}
            backgroundColor="hsla(220, 10%, 50%, 0.1)"
            foregroundColor="hsla(220, 10%, 50%, 0.05)"
          >
            <rect x="0" y="0" width="50" height="15" />
            <rect x="0" y="30" width="300" height="40" />
            <rect x="0" y="90" width="500" height="20" />
            <rect x="0" y="120" width="500" height="20" />
            <rect x="0" y="150" width="300" height="20" />
          </ContentLoader>
        </Block>
      </Inner>
    </Wrapper>
  )
}

const Detail: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <Box>
      <Text variant="caps" css={{ mb: '$4', color: '$secondary' }}>
        {label}
      </Text>
      {children}
    </Box>
  )
}

const DetailsSchedules = ({
  schedules,
}: {
  schedules: NonNullable<DetailsData['details']>['schedules']
}) => {
  const { t } = useTranslations()

  return (
    <>
      {/* Mobile schedules */}
      <Block css={{ '@md': { display: 'none' } }}>
        <Detail label={t('schedules')}>
          {schedules.map((schedule) => (
            <Box
              key={schedule.start_time}
              css={{
                mt: '$8',
                border: '1px solid $muted',
                borderRadius: '$md',
                '&:not(:last-child)': {
                  mb: '$8',
                },
              }}
            >
              <Stack
                css={{
                  justifyContent: 'space-between',
                  p: '$8',
                  borderBottom: '1px solid $muted',
                }}
              >
                <Text variant="caps">{schedule.channel.name}</Text>
                <Text variant="caps">
                  {dayjs(schedule.start_time).format('DD/MM/YYYY HH:MM')}
                </Text>
              </Stack>
              <Box css={{ p: '$8' }}>
                <Text variant="small">{schedule.title}</Text>
              </Box>
            </Box>
          ))}
        </Detail>
      </Block>

      {/* Desktop schedules */}
      <Table
        css={{
          display: 'none',
          '@md': { display: 'table', mt: '$24', mb: '$40' },
        }}
      >
        <Thead>
          <Tr>
            <Th css={{ width: '60%' }}>{t('schedules.title')}</Th>
            <Th css={{ width: '20%' }}>{t('schedules.channel')}</Th>
            <Th css={{ width: '10%' }}>{t('schedules.date')}</Th>
            <Th css={{ width: '10%' }}>{t('schedules.time')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {schedules.map((schedule) => (
            <Tr key={schedule.start_time}>
              <Td>{schedule.title}</Td>
              <Td>{schedule.channel.name}</Td>
              <Td>{dayjs(schedule.start_time).format('DD/MM/YYYY')}</Td>
              <Td>{dayjs(schedule.start_time).format('HH:MM')}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )
}

const Wrapper = styled('article', {
  width: '100%',
  height: '100%',
  borderLeft: '1px solid $muted',
  backgroundColor: '$panel',
})

const Header = styled('header', {
  borderBottom: '1px solid $muted',
  p: '$12',
  height: '$detailsTopbar',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '@md': {
    pr: '$12',
    pl: '$24',
  },
})

const Inner = styled('div', {
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  height: 'calc($vh - $topbar - $detailsTopbar)',

  pb: '$40',
})

const Block = styled('div', {
  p: '$16 $12',

  '@md': {
    p: '$16 $24',
  },
})
