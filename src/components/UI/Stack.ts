import { styled, space } from 'lib/style'

type Direction = 'vertical' | 'horizontal'

const spaceChildren = (
  direction: Direction,
  spacing: `$${keyof typeof space}`
) => {
  return {
    '& > *:not(:last-child)':
      direction === 'horizontal'
        ? {
            marginRight: spacing,
            marginBottom: 'unset',
          }
        : {
            marginBottom: spacing,
            marginRight: 'unset',
          },
  }
}

const spaces = {
  xs: '$2',
  sm: '$4',
  md: '$8',
  lg: '$16',
  xl: '$24',
} as const

export const Stack = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',

  variants: {
    direction: {
      horizontal: {
        flexDirection: 'row',
      },
      vertical: {
        flexDirection: 'column',
      },
    },
    spacing: Object.fromEntries(
      Object.entries(spaces).map(([key]) => [key, {}])
    ),
  },

  compoundVariants: [
    ...Object.entries(spaces).map(([key, value]) => ({
      direction: 'horizontal' as const,
      spacing: key as keyof typeof spaces,
      css: spaceChildren('horizontal', value),
    })),
    ...Object.entries(spaces).map(([key, value]) => ({
      direction: 'vertical' as const,
      spacing: key as keyof typeof spaces,
      css: spaceChildren('vertical', value),
    })),
  ],

  defaultVariants: {
    direction: 'horizontal',
    spacing: 'md',
  },
})
