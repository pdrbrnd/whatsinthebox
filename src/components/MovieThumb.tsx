import { usePlausible } from 'next-plausible'
import NextLink from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { styled } from 'lib/style'
import { PlausibleEvents } from 'common/constants'

import { Box, Text } from './UI'
import { Rating } from './Rating'

type Props = {
  imdbId: string
  image: string
  title: string
  year: string
  imdbRating?: string | null
  rottenRating?: string | null
  isActive?: boolean
  isTonedDown?: boolean
}

export const MovieThumb = ({
  imdbId,
  image,
  title,
  year,
  imdbRating,
  rottenRating,
  isActive,
  isTonedDown,
}: Props) => {
  const plausible = usePlausible()
  const {
    query: { id },
  } = useRouter()

  useEffect(() => {
    if (id && typeof id === 'string') {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [id])

  return (
    <NextLink href={{ query: { id: imdbId } }} passHref>
      <Holder
        id={imdbId} // scroll target
        onClick={() => {
          plausible(PlausibleEvents.OpenDetails, {
            props: {
              title,
              imdbId,
            },
          })
        }}
        css={{
          backgroundColor: isActive ? '$muted' : undefined,
          opacity: isTonedDown ? '0.5' : undefined,
        }}
      >
        <Poster style={{ backgroundImage: `url(${image})` }} />
        <Box css={{ mt: '$8' }}>
          <Text variant="tiny" css={{ mb: '$2' }}>
            {year}
          </Text>
          <Title variant="small">{title}</Title>
        </Box>
        {(imdbRating || rottenRating) && (
          <Rating css={{ mt: '$8' }} imdb={imdbRating} rotten={rottenRating} />
        )}
      </Holder>
    </NextLink>
  )
}

const Holder = styled('a', {
  display: 'block',
  p: '$8',
  borderRadius: '$md',
  transition: 'background-color $appearance, opacity $appearance',

  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    boxShadow: '$focus',
  },

  '@hover': {
    cursor: 'pointer',

    '&:hover': {
      opacity: 1,
      backgroundColor: '$muted',
    },
  },
})

const Poster = styled('div', {
  position: 'relative',
  borderRadius: '$md',

  width: '100%',
  paddingBottom: '150%',
  height: 'auto',

  backgroundColor: '$secondary',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',

  boxShadow: `
    0 1px 1px rgba(0, 0, 0, 0.05), 
    0 4px 8px rgba(0, 0, 0, 0.1), 
    inset 0 0 0 1px rgba(0,0,0,0.075), 
    inset 0 1px 0 1px rgba(255, 255, 255, 0.05)
  `,
})

const Title = styled(Text, {
  fontWeight: '$medium',
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})
