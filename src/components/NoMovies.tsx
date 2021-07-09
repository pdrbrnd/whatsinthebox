import { useTranslations } from 'lib/i18n'

import { Box, Text } from './UI'

export const NoMovies = () => {
  const { t } = useTranslations()

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'calc(100vh - $topbar)',
        opacity: 1,
      }}
    >
      <Box css={{ mt: '10vh', textAlign: 'center' }}>
        <Text variant="big" css={{ fontWeight: '$medium' }}>
          {t('notFound.title')}
        </Text>
        <Text variant="small" css={{ mt: '$4', color: '$secondary' }}>
          {t('notFound.text')}
        </Text>
      </Box>
      <img src="/travolta.gif" alt="no results found" />
    </Box>
  )
}
