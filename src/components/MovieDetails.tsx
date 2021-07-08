import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { useRouter } from 'next/dist/client/router'
import ContentLoader from 'react-content-loader'

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
} from 'components/UI'
import { External } from 'components/Icons'
import { Rating } from 'components/Rating'

type Props = {
  imdbId: string
  onClose: () => void
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
  pl: '$24',
  height: '50px',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Inner = styled('div', {
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  height: 'calc(100vh - $topbar - 50px)',

  pb: '$40',
})

const Top = styled('div', {
  p: '$16 $24',
})

const Bottom = styled('div', {
  p: '$16 $24',
})

export const MovieDetails = ({ imdbId, onClose }: Props) => {
  const {
    query: { mode },
  } = useRouter()

  const { data, isLoading } = useQuery<{
    details: {
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
  }>(`movie-${imdbId}`, async () => {
    const res = await fetch(`/api/movies/${imdbId}`)

    if (!res.ok) throw new Error('Could not fetch movie')

    return res.json()
  })

  if (isLoading || !data) {
    return (
      <Wrapper>
        <Header>
          <ContentLoader
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
          <Top>
            <ContentLoader
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
          </Top>
        </Inner>
      </Wrapper>
    )
  }

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
        {(rating_imdb || rating_rotten_tomatoes) && (
          <Rating imdb={rating_imdb} rotten={rating_rotten_tomatoes} />
        )}
        <CloseButton onClick={() => onClose()} />
      </Header>
      <Inner>
        <Top>
          {year && <Text variant="tiny">{year}</Text>}
          {title && (
            <Text variant="title" css={{ mt: '$4', mb: '$8' }}>
              {title}
            </Text>
          )}
          {plot && <Text>{plot}</Text>}
        </Top>
        <Table css={{ mt: '$24', mb: '$40' }}>
          <Thead>
            <Tr>
              <Th css={{ width: '60%' }}>Title</Th>
              <Th css={{ width: '20%' }}>Channel</Th>
              <Th css={{ width: '10%' }}>Date</Th>
              <Th css={{ width: '10%' }}>Time</Th>
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
        <Bottom>
          <Stack
            direction="vertical"
            spacing="xl"
            css={{ alignItems: 'flex-start' }}
          >
            {genre && (
              <Detail label="Genre">
                <Stack css={{ mt: '$8' }} spacing="sm">
                  {genre.split(',').map((gen, i) => (
                    <Text
                      key={i}
                      variant="tiny"
                      css={{
                        display: 'inline-flex',
                        p: '$4 $8',
                        borderRadius: '$pill',
                        border: '1px solid $muted',
                      }}
                    >
                      {gen}
                    </Text>
                  ))}
                </Stack>
              </Detail>
            )}
            {[
              { label: 'Runtime', data: runtime },
              { label: 'Director', data: director },
              { label: 'Actors', data: actors },
              { label: 'Writer', data: writer },
              { label: 'Country', data: country },
              { label: 'Language', data: language },
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
            >
              <Stack spacing="lg">
                <span>Open in IMDB</span>
                <Box css={{ color: '$secondary' }}>
                  <External />
                </Box>
              </Stack>
            </Button>
            {mode === 'aaargh' && (
              <Button
                css={{
                  display: 'inline-flex',
                  backgroundColor: 'blueviolet',
                  color: 'white',
                  '&:hover': {
                    opacity: 0.8,
                    backgroundColor: 'blueviolet',
                  },
                }}
                as="a"
                href={`stremio://detail/movie/${imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Stremio
              </Button>
            )}
          </Stack>
        </Bottom>
      </Inner>
    </Wrapper>
  )
}

const Detail: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <Box>
      <Text variant="caps" css={{ mb: '$4' }}>
        {label}
      </Text>
      {children}
    </Box>
  )
}
