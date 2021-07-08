import { styled } from 'lib/style'

export const Table = styled('table', {
  borderCollapse: 'collapse',
  border: 0,

  width: '100%',
})

export const Thead = styled('thead', {})

export const Tbody = styled('tbody', {})

export const Tr = styled('tr', {
  borderBottom: '1px solid $muted',

  '&:nth-child(even)': {
    background: '$subtle',
  },
})

export const Th = styled('th', {
  textAlign: 'left',
  fontSize: '$xs',
  fontWeight: '$medium',
  lineHeight: '$none',
  textTransform: 'uppercase',
  letterSpacing: '$wide',

  p: '$16 $8',

  '&:first-of-type': {
    pl: '$24',
  },
  '&:last-of-type': {
    pr: '$24',
  },
})

export const Td = styled('td', {
  fontSize: '$sm',
  lineHeight: '$normal',

  p: '$12 $8',

  '&:first-of-type': {
    pl: '$24',
  },
  '&:last-of-type': {
    pr: '$24',
  },
})
