import React from 'react'
import Head from 'next/head'

import { App } from 'components/App'

const IndexPage: React.FC = () => (
  <>
    <Head>
      <title>
        Find good movies from the last 7 days of Portuguese television
      </title>
    </Head>
    <App />
  </>
)

export default IndexPage
