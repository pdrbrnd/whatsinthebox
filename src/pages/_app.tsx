import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import PlausibleProvider from 'next-plausible'

import { global, darkTheme, lightTheme } from 'lib/style'
import { FiltersProvider } from 'lib/filters'
import { TranslationsProvider } from 'lib/i18n'

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

  return (
    <PlausibleProvider domain="whatsinthebox.tv">
      <ThemeProvider
        storageKey="witb-theme"
        value={{ light: lightTheme.toString(), dark: darkTheme.toString() }}
        attribute="class"
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <FiltersProvider>
            <TranslationsProvider>
              <Component {...pageProps} />
            </TranslationsProvider>
          </FiltersProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PlausibleProvider>
  )
}

export default App
