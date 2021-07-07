import { useQuery } from 'react-query'
import { useRouter } from 'next/dist/client/router'

import { styled } from 'lib/style'
import { Box, Stack, Button, Text } from 'components/UI'
import { Close } from 'components/Icons'
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
  p: '$16 $24',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

  const { data } = useQuery<{
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
    }
  }>(`movie-${imdbId}`, async () => {
    const res = await fetch(`/api/movies/${imdbId}`)

    if (!res.ok) throw new Error('Could not fetch movie')

    return res.json()
  })

  if (!data) return <Wrapper />

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
    },
  } = data

  return (
    <Wrapper>
      <Header>
        {(rating_imdb || rating_rotten_tomatoes) && (
          <Rating imdb={rating_imdb} rotten={rating_rotten_tomatoes} />
        )}
        <Box
          role="button"
          tabIndex={0}
          onClick={() => onClose()}
          onKeyPress={(e) => {
            if ([' ', 'Enter'].includes(e.key)) {
              e.preventDefault()
              onClose()
            }
          }}
          css={{
            border: '1px solid $muted',
            borderRadius: '$sm',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity $appearance',
            p: '$6',
            '&:focus': {
              outline: 'none',
            },
            '&:focus-visible': {
              boxShadow: '$focus',
            },
            '@hover': {
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.75,
              },
            },
          }}
        >
          <Close />
        </Box>
      </Header>
      <Top>
        {year && <Text variant="tiny">{year}</Text>}
        {title && (
          <Text variant="title" css={{ mt: '$4', mb: '$8' }}>
            {title}
          </Text>
        )}
        {plot && <Text>{plot}</Text>}
      </Top>
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
                    variant="caps"
                    css={{
                      display: 'inline-flex',
                      p: '$2 $4',
                      borderRadius: '$md',
                      backgroundColor: '$muted',
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
            Open in IMDB
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
