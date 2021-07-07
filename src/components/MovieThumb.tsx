import { styled } from 'lib/style'

import { Box, Text } from './UI'
import { Rating } from './Rating'

const Holder = styled('div', {
  p: '$8',
  borderRadius: '$md',
  transition: 'background-color $appearance',
})

const Poster = styled('img', {
  borderRadius: '$md',

  width: '100%',
  height: 'auto',
})

type Props = {
  image: string
  title: string
  year: string
  imdbRating?: string
  rottenRating?: string
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
    <Holder css={isActive ? { backgroundColor: '$subtle' } : {}}>
      <Poster src={image} alt={`poster for ${title}`} />
      <Box css={{ mt: '$8' }}>
        <Text variant="tiny">{year}</Text>
        <Text variant="small" css={{ fontWeight: '$medium' }}>
          {title}
        </Text>
      </Box>
      {(imdbRating || rottenRating) && (
        <Rating css={{ mt: '$8' }} imdb={imdbRating} rotten={rottenRating} />
      )}
    </Holder>
  )
}
