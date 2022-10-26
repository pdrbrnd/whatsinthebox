import splitbee from '@splitbee/web'

import { styled } from 'lib/style'

import { Coffee } from './Icons'
import { Button, Stack } from './UI'

export const BuyMeACoffee = () => {
  return (
    <Holder
      as="a"
      href="https://ko-fi.com/pdrbrnd"
      target="_blank"
      rel="noopener noreferrer"
      size="lg"
      onClick={() => {
        splitbee.track('Buy me a coffee')
      }}
    >
      <Stack>
        <Coffee />
        <span>Buy me a coffee</span>
      </Stack>
    </Holder>
  )
}

const Holder = styled(Button, {
  display: 'inline-flex',
  backgroundColor: '$accent',
  color: '$background',
  transition: 'opacity $appearance',
  '@hover': {
    '&:hover': { backgroundColor: '$accent', opacity: '0.7' },
  },
})
