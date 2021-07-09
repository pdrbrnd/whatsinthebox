import { styled } from 'lib/style'

export const Input = styled('input', {
  appearance: 'none',
  boxShadow: 'none',

  border: '1px solid $muted',
  p: '$8',
  borderRadius: '$sm',

  width: '100%',

  backgroundColor: 'transparent',
  color: '$foreground',
  fontFamily: '$sans',
  fontSize: '$sm',
  lineHeight: '$none',
  fontWeight: '$normal',

  '&::placeholder': {
    color: '$secondary',
  },

  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    boxShadow: '$focus',
  },
})

export const VanillaInput = styled('input', {
  appearance: 'none',
  boxShadow: 'none',
  border: 0,

  width: '100%',
  borderRadius: '$sm',

  py: '$4',

  backgroundColor: 'transparent',

  color: '$foreground',
  fontFamily: '$sans',
  fontSize: '$sm',
  lineHeight: '$none',
  fontWeight: '$normal',

  '&::placeholder': {
    color: '$secondary',
  },

  '&:focus': {
    outline: 'none',
  },
})
