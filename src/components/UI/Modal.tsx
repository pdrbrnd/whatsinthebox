import { styled } from 'lib/style'

import { CloseButton, Text } from './'

type Props = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export const Modal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null

  return (
    <Overlay onClick={() => onClose()}>
      <Card
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </Card>
    </Overlay>
  )
}

type ModalHeaderProps = {
  onClose: () => void
  title: string
}

export const ModalHeader = ({ onClose, title }: ModalHeaderProps) => {
  return (
    <Header>
      <Text variant="caps">{title}</Text>
      <CloseButton onClick={onClose} />
    </Header>
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

const Card = styled('div', {
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

export const ModalBody = styled('div', {
  p: '$16',

  '@md': {
    p: '$16 $24',
  },
})

export const ModalFooter = styled('div', {
  borderTop: '1px solid $muted',
  color: '$secondary',
  p: '$16',

  '@md': {
    p: '$16 $24',
    pb: '$24',
  },
})
