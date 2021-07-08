import { ButtonHTMLAttributes } from 'react'

import { styled, CSS } from 'lib/style'
import { Close } from 'components/Icons'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  css?: CSS
}

const StyledClosedButton = styled('button', {
  appearance: 'none',
  boxShadow: 'none',
  background: 'transparent',
  color: '$foreground',

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
})

export const CloseButton = (props: Props) => {
  return (
    <StyledClosedButton {...props}>
      <Close />
    </StyledClosedButton>
  )
}
