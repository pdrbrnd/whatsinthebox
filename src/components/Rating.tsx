import { CSS } from 'lib/style'

import { Imdb, RottenTomatoes } from './Icons'
import { Box, Stack, Text } from './UI'

type Props = {
  css?: CSS
  imdb?: string
  rotten?: string
}

export const Rating = ({ css, imdb, rotten }: Props): JSX.Element | null => {
  if (!imdb && !rotten) return null

  return (
    <Stack spacing="md" css={css}>
      {imdb && (
        <Stack spacing="sm">
          <Box css={{ display: 'flex', color: '$imdb' }}>
            <Imdb />
          </Box>
          <Text variant="tiny">{imdb}</Text>
        </Stack>
      )}
      {rotten && (
        <Stack spacing="sm">
          <Box css={{ display: 'flex', color: '$rotten' }}>
            <RottenTomatoes />
          </Box>
          <Text variant="tiny">{imdb}</Text>
        </Stack>
      )}
    </Stack>
  )
}
