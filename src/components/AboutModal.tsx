import { usePlausible } from 'next-plausible'

import { useTranslations } from 'lib/i18n'

import { BigLogo, Coffee } from './Icons'
import { Box, Text, CloseButton, Button, Stack } from './UI'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AboutModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslations()
  const plausible = usePlausible()

  if (!isOpen) return null

  return (
    <Box
      onClick={() => onClose()}
      css={{
        position: 'absolute',
        zIndex: '$max',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation()
        }}
        css={{
          background: '$panel',
          border: '1px solid $muted',
          width: 'clamp(300px, 100%, 520px)',
          m: '$16',
          borderRadius: '$md',

          maxHeight: 'calc(100vh - $space$16 * 2)',
          scrollbarWidth: 'thin',
          overflowY: 'auto',

          '@md': {
            overflowY: 'visible',
          },
        }}
      >
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid $muted',
            p: '$8 $16',

            '@md': {
              p: '$16 $24',
            },
          }}
        >
          <Text variant="caps">{t('about')}</Text>
          <CloseButton onClick={onClose} />
        </Box>
        <Box
          css={{
            p: '$16',

            '@md': {
              p: '$16 $24',
            },
          }}
        >
          <Text variant="huge">{t('about.title')}</Text>
          <Text variant="big" css={{ fontWeight: '$medium', mt: '$16' }}>
            {t('about.description')}
          </Text>
          <Box
            css={{
              color: '$accent',
              svg: { width: '100%' },

              display: 'none',

              '@sm': {
                display: 'block',
              },

              '@md': {
                my: '$40',
                mx: 'calc($40 * -2)',
              },
            }}
          >
            <BigLogo />
          </Box>
        </Box>
        <Box
          css={{
            borderTop: '1px solid $muted',
            color: '$secondary',
            p: '$16',

            '@md': {
              p: '$16 $24',
              pb: '$24',
            },
          }}
        >
          <Text variant="small" css={{ fontWeight: '$medium' }}>
            {t('about.footer')}
          </Text>
          <Box css={{ mt: '$16', display: 'flex', justifyContent: 'center' }}>
            <Button
              as="a"
              href="https://buymeacoffee.com/pedrob"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              onClick={() => {
                plausible('buy me a coffee')
              }}
              css={{
                display: 'inline-flex',
                backgroundColor: '$accent',
                color: '$background',
                transition: 'opacity $appearance',
                '@hover': {
                  '&:hover': { backgroundColor: '$accent', opacity: '0.7' },
                },
              }}
            >
              <Stack>
                <Coffee />
                <span>Buy me a coffee</span>
              </Stack>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
