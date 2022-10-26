import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

import { TranslationsProvider } from 'lib/i18n'
import { global, darkTheme, lightTheme } from 'lib/style'

const globalStyles = global({
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
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  'body, button, input': {
    fontFamily: '$sans',
  },
  body: {
    color: '$foreground',
    backgroundColor: '$background',
  },
  '::selection': {
    color: '$background',
    backgroundColor: '$foreground',
  },
})

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  globalStyles()

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVh()
    window.addEventListener('load', setVh)
    window.addEventListener('resize', setVh)

    return () => {
      window.removeEventListener('load', setVh)
      window.removeEventListener('resize', setVh)
    }
  }, [])

  return (
    <ThemeProvider
      storageKey="witb-theme"
      value={{ light: lightTheme.toString(), dark: darkTheme.toString() }}
      attribute="class"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TranslationsProvider>
          <Component {...pageProps} />
        </TranslationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
