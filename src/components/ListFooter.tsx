import { Box, Text } from 'components/UI'
import { useTranslations } from 'lib/i18n'

const FooterLink = ({ link, label }: { link: string; label: string }) => {
  return (
    <Text
      variant="tiny"
      as="a"
      rel="noopener noreferrer"
      target="_blank"
      href={link}
      css={{ color: '$accent' }}
    >
      {label}
    </Text>
  )
}

export const ListFooter = () => {
  const { t } = useTranslations()

  return (
    <Box css={{ borderTop: '1px dashed $muted', py: '$24' }}>
      <Text variant="tiny" css={{ color: '$secondary' }}>
        {t('list.footer.builtBy')}{' '}
        <FooterLink link="https://github.com/pdrbrnd" label="pdrbrnd" />.{' '}
        {t('list.footer.support')}{' '}
        <FooterLink
          link="https://www.ko-fi.com/pdrbrnd"
          label={t('list.footer.donate')}
        />
        .
      </Text>
    </Box>
  )
}
