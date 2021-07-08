import { ButtonHTMLAttributes, forwardRef, ReactElement } from 'react'

import { styled, CSS } from 'lib/style'

import { Box, Stack } from './'

export const Button = styled('button', {
  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  appearance: 'none',
  boxShadow: 'none',
  border: 0,

  color: '$foreground',
  backgroundColor: '$muted',
  borderRadius: '$sm',

  lineHeight: '$none',
  textTransform: 'uppercase',
  letterSpacing: '$wide',
  fontWeight: '$medium',

  textDecoration: 'none',

  transition: 'background-color $appearance, opacity $appearance',

  '@hover': {
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: '$tertiary',
    },
  },

  '&:active': {
    opacity: 0.8,
  },

  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    boxShadow: '$focus',
  },

  variants: {
    size: {
      sm: {
        p: '$2 $4',
        fontSize: '$xxs',
      },
      md: {
        p: '$4 $8',
        fontSize: '$xs',
      },
      lg: {
        p: '$8 $12',
        fontSize: '$xs',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactElement
  css?: CSS
  iconColor?: CSS['color']
  iconPosition?: 'left' | 'right' // only one icon per button
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      children,
      icon,
      iconColor = '$secondary',
      iconPosition = 'left',
      ...props
    },
    ref
  ) {
    return (
      <Button ref={ref} {...props}>
        <Stack>
          {iconPosition === 'left' && (
            <Box css={{ color: iconColor }}>{icon}</Box>
          )}
          <span>{children}</span>
          {iconPosition === 'right' && (
            <Box css={{ color: iconColor }}>{icon}</Box>
          )}
        </Stack>
      </Button>
    )
  }
)
