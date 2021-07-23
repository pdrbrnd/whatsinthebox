import { CSS } from 'lib/style'

import { Imdb, RottenTomatoes } from './Icons'
import { Stack, Text } from './UI'

type Props = {
  css?: CSS
  imdb?: string | null
  rotten?: string | null
}

export const Rating = ({ css, imdb, rotten }: Props): JSX.Element | null => {
  if (!imdb && !rotten) return null

  return (
    <Stack spacing="8" css={css}>
      {imdb && (
        <Stack spacing="4">
          <Imdb />
          <Text variant="tiny">{imdb}</Text>
        </Stack>
      )}
      {rotten && (
        <Stack spacing="4">
          <RottenTomatoes />
          <Text variant="tiny">{rotten}</Text>
        </Stack>
      )}
    </Stack>
  )
}
