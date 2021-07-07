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
    <Stack spacing="md" css={css}>
      {imdb && (
        <Stack spacing="sm">
          <Imdb />
          <Text variant="tiny">{imdb}</Text>
        </Stack>
      )}
      {rotten && (
        <Stack spacing="sm">
          <RottenTomatoes />
          <Text variant="tiny">{rotten}</Text>
        </Stack>
      )}
    </Stack>
  )
}
