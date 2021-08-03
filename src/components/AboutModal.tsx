import { useTranslations } from 'lib/i18n'
import { styled } from 'lib/style'

import { BuyMeACoffee } from './BuyMeACoffee'
import { BigLogo } from './Icons'
import { Box, Text, Modal, ModalHeader, ModalBody, ModalFooter } from './UI'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AboutModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslations()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose} title={t('about')} />
      <ModalBody>
        <Text variant="huge">{t('about.title')}</Text>
        <Text variant="big" css={{ fontWeight: '$medium', mt: '$16' }}>
          {t('about.description')}
        </Text>

        <LogoHolder>
          <BigLogo />
        </LogoHolder>
      </ModalBody>
      <ModalFooter>
        <Text variant="small" css={{ fontWeight: '$medium' }}>
          {t('about.footer')}
        </Text>
        <Box css={{ mt: '$16', display: 'flex', justifyContent: 'center' }}>
          <BuyMeACoffee />
        </Box>
      </ModalFooter>
    </Modal>
  )
}

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
