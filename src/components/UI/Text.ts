import { styled } from 'lib/style'

export const Text = styled('p', {
  variants: {
    variant: {
      caps: {
        fontSize: '$xs',
        fontWeight: '$medium',
        lineHeight: '$none',
        textTransform: 'uppercase',
        letterSpacing: '$wide',
      },
      tiny: {
        fontSize: '$xs',
        fontWeight: '$medium',
        lineHeight: '$none',
      },
      small: {
        fontSize: '$sm',
        lineHeight: '$normal',
      },
      body: {
        fontSize: '$md',
        lineHeight: '$normal',
      },
      big: {
        fontSize: '$lg',
        lineHeight: '$normal',
        fontWeight: '$medium',
      },
      title: {
        fontSize: '$xl',
        lineHeight: '$small',
        fontWeight: '$medium',
      },
      huge: {
        fontSize: '$xxl',
        lineHeight: '$tight',
        fontWeight: '$medium',
      },
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})
