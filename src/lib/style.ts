import { createCss, StitchesCss } from '@stitches/react'

const toRem = (px: number) => px / 16 + 'rem'

export const space = {
  0: '0',
  1: toRem(1),
  2: toRem(2),
  4: toRem(4),
  6: toRem(6),
  8: toRem(8),
  10: toRem(10),
  12: toRem(12),
  14: toRem(14),
  16: toRem(16),
  20: toRem(20),
  24: toRem(24),
  28: toRem(28),
  32: toRem(32),
  36: toRem(36),
  40: toRem(40),
} as const

const palette = {
  gray50: 'hsla(0, 0%, 100%, 1)',
  gray100: 'hsla(220, 10%, 98%, 1)',
  gray200: 'hsla(220, 10%, 93%, 1)',
  gray250: 'hsla(220, 10%, 88%, 1)',
  gray300: 'hsla(210, 8%, 72%, 1)',
  gray400: 'hsla(210, 5%, 48%, 1)',
  gray500: 'hsla(220, 2%, 26%, 1)',
  gray600: 'hsla(223, 8%, 19%, 1)',
  gray700: 'hsla(220, 6%, 15%, 1)',
  gray800: 'hsla(220, 7%, 11%, 1)',
  gray900: 'hsla(220, 7%, 8%, 1)',
  yellow: 'hsla(50, 100%, 60%, 1)',
  yellowAlpha: 'hsla(50, 100%, 60%, 0.6)',
  blue: 'hsla(210, 100%, 50%, 1)',
  blueAlpha: 'hsla(210, 100%, 50%, 0.6)',
}

const dark = {
  background: '$gray900',
  panel: '$gray800',

  subtle: '$gray700', // zebra stripes
  muted: '$gray600', // borders, button bg
  tertiary: '$gray500', // placeholders
  secondary: '$gray400', // checkbox borders, secondary text
  foreground: '$gray50',
  accent: '$yellow',
  focus: '$yellowAlpha',
}

const light = {
  background: '$gray100',
  panel: '$gray50',

  subtle: '$gray100',
  muted: '$gray200',
  tertiary: '$gray250',
  secondary: '$gray300',
  foreground: '$gray800',
  accent: '$blue',
  focus: '$blueAlpha',
}

type SpaceValue = `$${keyof typeof space}` | (string & Record<never, never>)

const stitchesConfig = createCss({
  theme: {
    colors: {
      ...palette,
      ...dark,
    },
    fonts: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      bold: '600',
    },
    fontSizes: {
      xxs: toRem(10),
      xs: toRem(12),
      sm: toRem(14),
      md: toRem(16),
      lg: toRem(20),
      xl: toRem(32),
      xxl: toRem(36),
    },
    lineHeights: {
      none: 1,
      tight: 1.075,
      small: 1.2,
      normal: 1.375,
      double: 2,
    },
    letterSpacings: {
      wide: '0.04em',
    },
    space,
    sizes: {
      checkbox: '12px',
      topbar: '40px',
      sidebar: '250px',
      scroll: 'calc(100vh - $topbar)',
      details: '550px',
    },
    radii: {
      none: 0,
      xs: toRem(1),
      sm: toRem(2),
      md: toRem(4),
      full: '100%',
    },
    zIndices: {
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      max: 999,
    },
    transitions: {
      appearance: '0.2s ease',
      motion: '0.3s cubic-bezier(0.2, 1, 0.2, 1)',
    },
    shadows: {
      focus: '0 0 0 3px $colors$focus',
    },
  },
  media: {
    sm: '(min-width: 30em)',
    md: '(min-width: 48em)',
    lg: '(min-width: 62em)',
    xl: '(min-width: 80em)',
    xxl: '(min-width: 96em)',
    hover: '(hover: hover)',
  },
  utils: {
    m: () => (value: SpaceValue) => ({
      margin: value,
    }),
    mt: () => (value: SpaceValue) => ({
      marginTop: value,
    }),
    mr: () => (value: SpaceValue) => ({
      marginRight: value,
    }),
    mb: () => (value: SpaceValue) => ({
      marginBottom: value,
    }),
    ml: () => (value: SpaceValue) => ({
      marginLeft: value,
    }),
    mx: () => (value: SpaceValue) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: () => (value: SpaceValue) => ({
      marginTop: value,
      marginBottom: value,
    }),
    p: () => (value: SpaceValue) => ({
      padding: value,
    }),
    pt: () => (value: SpaceValue) => ({
      paddingTop: value,
    }),
    pr: () => (value: SpaceValue) => ({
      paddingRight: value,
    }),
    pb: () => (value: SpaceValue) => ({
      paddingBottom: value,
    }),
    pl: () => (value: SpaceValue) => ({
      paddingLeft: value,
    }),
    px: () => (value: SpaceValue) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: () => (value: SpaceValue) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
})

export const { styled, css, global, keyframes, getCssString, theme } =
  stitchesConfig

export const darkTheme = theme('witb-dark', {
  colors: dark,
})

export const lightTheme = theme('witb-light', {
  colors: light,
})

export type CSS = StitchesCss<typeof stitchesConfig>
