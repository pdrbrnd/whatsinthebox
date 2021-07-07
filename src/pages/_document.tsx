import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import { getCssString } from 'lib/style'

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
          <link
            rel="preload"
            href="/fonts/Inter-Regular.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-Medium.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-Medium.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-SemiBold.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Inter-SemiBold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
@font-face {
  font-family: 'Inter';
  font-weight: 400;
  font-display: swap;
  src: url(/fonts/Inter-Regular.woff2) format('woff2'), url(/fonts/Inter-Regular.woff) format('woff');
}
@font-face {
  font-family: 'Inter';
  font-weight: 500;
  font-display: swap;
  src: url(/fonts/Inter-Medium.woff2) format('woff2'), url(/fonts/Inter-Medium.woff) format('woff');
}
@font-face {
  font-family: 'Inter';
  font-weight: 600;
  font-display: swap;
  src: url(/fonts/Inter-SemiBold.woff2) format('woff2'), url(/fonts/Inter-SemiBold.woff) format('woff');
}
`,
            }}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="131416" />
          <meta name="theme-color" content="131416" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
