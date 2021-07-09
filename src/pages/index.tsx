import React from 'react'
import Head from 'next/head'

import { App } from 'components/App'
import { useTranslations } from 'lib/i18n'

const IndexPage: React.FC = () => {
  const { t } = useTranslations()

  return (
    <>
      <Head>
        <title>{t('document.title')}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <App />
    </>
  )
}

export default IndexPage
