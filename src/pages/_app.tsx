import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'

import { global, darkTheme, lightTheme } from 'lib/style'

const globalStyles = global({
  'html, body, #__next': {
    height: '100vh',
    overflow: 'hidden',
  },
  html: {
    boxSizing: 'border-box',
  },
  '*, *:before, *:after': {
    boxSizing: 'inherit',
  },
  'body, h1, h2, h3, h4, h5, h6, p, ol, ul': {
    margin: 0,
    padding: 0,
    fontWeight: 'normal',
  },
  img: {
    maxWidth: '100%',
    height: 'auto',
  },
  'body, button, input': {
    fontFamily: '$sans',
  },
  body: {
    color: '$foreground',
    backgroundColor: '$background',
  },
  '::selection': {
    backgroundColor: '$muted',
  },
})

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  globalStyles()

  return (
    <ThemeProvider
      storageKey="witb-theme"
      value={{ light: lightTheme.toString(), dark: darkTheme.toString() }}
      attribute="class"
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
