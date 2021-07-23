import { styled, space, CSS } from 'lib/style'

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
      Object.entries(space).map(([key]) => [key, {}])
    ) as Record<keyof typeof space, CSS>,
  },

  compoundVariants: [
    ...Object.keys(space).map((key) => ({
      direction: 'horizontal' as const,
      spacing: key as `${keyof typeof space}`,
      css: spaceChildren('horizontal', `$${key}` as `$${keyof typeof space}`),
    })),
    ...Object.keys(space).map((key) => ({
      direction: 'vertical' as const,
      spacing: key as `${keyof typeof space}`,
      css: spaceChildren('vertical', `$${key}` as `$${keyof typeof space}`),
    })),
  ],

  defaultVariants: {
    direction: 'horizontal',
    spacing: '8',
  },
})
