import { ComponentProps } from 'react'

import { styled } from 'lib/style'

import { Text } from './Text'

const TinyText = (props: ComponentProps<typeof Text>) => (
  <Text variant="tiny" {...props} />
)

export const Tag = styled(TinyText, {
  display: 'inline-flex',
  p: '$4 $8',
  borderRadius: '$pill',
  border: '1px solid $muted',
})
