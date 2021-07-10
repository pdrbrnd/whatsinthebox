import { usePlausible } from 'next-plausible'

import { useTranslations } from 'lib/i18n'
import { styled } from 'lib/style'
import { PlausibleEvents } from 'common/constants'

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
    <Overlay onClick={() => onClose()}>
      <Modal
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Header>
          <Text variant="caps">{t('about')}</Text>
          <CloseButton onClick={onClose} />
        </Header>

        <Body>
          <Text variant="huge">{t('about.title')}</Text>
          <Text variant="big" css={{ fontWeight: '$medium', mt: '$16' }}>
            {t('about.description')}
          </Text>

          <LogoHolder>
            <BigLogo />
          </LogoHolder>
        </Body>

        <Footer>
          <Text variant="small" css={{ fontWeight: '$medium' }}>
            {t('about.footer')}
          </Text>
          <Box css={{ mt: '$16', display: 'flex', justifyContent: 'center' }}>
            <BuyMeACofee
              as="a"
              href="https://buymeacoffee.com/pedrob"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              onClick={() => {
                plausible(PlausibleEvents.BuyMeACoffee)
              }}
            >
              <Stack>
                <Coffee />
                <span>Buy me a coffee</span>
              </Stack>
            </BuyMeACofee>
          </Box>
        </Footer>
      </Modal>
    </Overlay>
  )
}

const Overlay = styled('div', {
  position: 'absolute',
  zIndex: '$max',
  width: '100vw',
  height: '$vh',

  backgroundColor: 'rgba(0, 0, 0, 0.8)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Modal = styled('div', {
  background: '$panel',
  border: '1px solid $muted',
  width: 'clamp(300px, 100%, 520px)',
  m: '$16',
  borderRadius: '$md',

  maxHeight: 'calc($vh - $space$16 * 2)',
  scrollbarWidth: 'thin',
  overflowY: 'auto',

  '@md': {
    overflowY: 'visible',
  },
})

const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid $muted',
  p: '$8 $16',

  '@md': {
    p: '$16 $24',
  },
})

const LogoHolder = styled('div', {
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
})

const Body = styled('div', {
  p: '$16',

  '@md': {
    p: '$16 $24',
  },
})

const Footer = styled('div', {
  borderTop: '1px solid $muted',
  color: '$secondary',
  p: '$16',

  '@md': {
    p: '$16 $24',
    pb: '$24',
  },
})

const BuyMeACofee = styled(Button, {
  display: 'inline-flex',
  backgroundColor: '$accent',
  color: '$background',
  transition: 'opacity $appearance',
  '@hover': {
    '&:hover': { backgroundColor: '$accent', opacity: '0.7' },
  },
})
