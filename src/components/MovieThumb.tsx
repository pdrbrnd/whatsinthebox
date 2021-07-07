import { styled } from 'lib/style'

import { Box, Text } from './UI'
import { Rating } from './Rating'

const Holder = styled('div', {
  p: '$8',
  borderRadius: '$md',
  transition: 'background-color $appearance',
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

type Props = {
  image: string
  title: string
  year: string
  imdbRating?: string | null
  rottenRating?: string | null
  isActive?: boolean
}

export const MovieThumb = ({
  image,
  title,
  year,
  imdbRating,
  rottenRating,
  isActive,
}: Props) => {
  return (
    <Holder css={isActive ? { backgroundColor: '$muted' } : {}}>
      <Poster style={{ backgroundImage: `url(${image})` }} />
      <Box css={{ mt: '$8' }}>
        <Text variant="tiny" css={{ mb: '$2' }}>
          {year}
        </Text>
        <Text
          variant="small"
          css={{
            fontWeight: '$medium',
            width: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Text>
      </Box>
      {(imdbRating || rottenRating) && (
        <Rating css={{ mt: '$8' }} imdb={imdbRating} rotten={rottenRating} />
      )}
    </Holder>
  )
}
