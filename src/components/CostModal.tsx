import { useTranslations } from 'lib/i18n'

import {
  Box,
  Text,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from './UI'
import { BuyMeACoffee } from './BuyMeACoffee'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const CostModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslations()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose} title={t('cost.title')} />
      <ModalBody>
        <Text variant="huge">{t('cost.text')}</Text>
        <Text variant="big" css={{ fontWeight: '$medium', mt: '$16' }}>
          {t('cost.price.title')}
        </Text>
        <Box
          css={{ my: '$16', border: '1px solid $muted', borderRadius: '$md' }}
        >
          <Table>
            <Thead>
              <Tr>
                <Th css={{ width: '60%' }}>{t('cost.price.item')}</Th>
                <Th>{t('cost.price.price')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Text variant="small">{t('cost.price.domain')}</Text>
                  <Text variant="small" css={{ color: '$secondary', mb: '$4' }}>
                    iwantmyname.com
                  </Text>
                </Td>
                <Td>40€ / {t('cost.price.year')}</Td>
              </Tr>
              <Tr>
                <Td>
                  <Text variant="small">{t('cost.price.hosting')}</Text>
                  <Text variant="small" css={{ color: '$secondary', mb: '$4' }}>
                    Digital Ocean
                  </Text>
                </Td>
                <Td>6€ / {t('cost.price.month')}</Td>
              </Tr>
              <Tr>
                <Td>
                  <Text variant="small">{t('cost.price.analytics')}</Text>
                  <Text variant="small" css={{ color: '$secondary', mb: '$4' }}>
                    Plausible (privacy-friendly)
                  </Text>
                </Td>
                <Td>6€ / {t('cost.price.month')}</Td>
              </Tr>
              <Tr css={{ borderBottom: 'none' }}>
                <Td css={{ color: '$accent' }}>{t('cost.price.total')}</Td>
                <Td css={{ color: '$accent' }}>
                  184€ / {t('cost.price.year')}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box css={{ display: 'flex', justifyContent: 'center' }}>
          <BuyMeACoffee />
        </Box>
      </ModalFooter>
    </Modal>
  )
}
