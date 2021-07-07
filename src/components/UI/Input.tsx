import { styled } from 'lib/style'

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
