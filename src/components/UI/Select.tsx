import { forwardRef, SelectHTMLAttributes } from 'react'

import { styled, CSS } from 'lib/style'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: 'normal' | 'caps'
  css?: CSS
}

const Holder = styled('div', {
  position: 'relative',
})

const StyledSelect = styled('select', {
  boxSizing: 'border-box',
  appearance: 'none',
  position: 'relative',

  cursor: 'pointer',

  display: 'flex',
  width: '100%',

  p: '$6 $8',
  pr: '$32',

  border: '1px solid $muted',
  borderRadius: '$sm',

  color: 'inherit',
  backgroundColor: 'transparent',

  transition: 'background-color $appearance, box-shadow $appearance',

  '&:hover': {
    backgroundColor: '$subtle',
  },

  '&:focus': {
    outline: 'none',
  },

  '&:focus-visible': {
    boxShadow: '$focus',
  },

  variants: {
    variant: {
      normal: {
        lineHeight: '$double',
        fontSize: '$sm',
      },
      caps: {
        fontSize: '$xs',
        fontWeight: '$bold',
        lineHeight: '$normal',
      },
    },
  },
  defaultVariants: {
    variant: 'normal',
  },
})

const Svg = styled('svg', {
  position: 'absolute',
  right: '$16',
  top: '50%',
  transform: 'translateY(-50%)',
})

const Chevron = () => {
  return (
    <Svg width={9} height={6} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.071 1L4.536 4.536 1 1" stroke="currentColor" />
    </Svg>
  )
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { variant = 'normal', css, ...props },
  ref
) {
  return (
    <Holder css={css}>
      <StyledSelect ref={ref} variant={variant} {...props} />
      <Chevron />
    </Holder>
  )
})
