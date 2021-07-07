import { forwardRef, InputHTMLAttributes } from 'react'

import { styled, CSS } from 'lib/style'

import { Text } from '.'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  css?: CSS
}

const Holder = styled('label', {
  boxSizing: 'content-box',
  display: 'flex',
  alignItems: 'center',
  minWidth: 'min-content',

  transition: 'background-color $appearance',

  p: '$6 $8',
  borderRadius: '$sm',

  '@hover': {
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: '$subtle',
    },
  },
})

const Input = styled('input', {
  position: 'absolute',
  opacity: 0,
  zIndex: -1,
  width: 1,
  height: 1,
  overflow: 'hidden',
})

const FakeElement = styled('div', {
  position: 'relative',
  width: '$checkbox',
  height: '$checkbox',

  border: '1px solid $secondary',

  transition: 'all $motion',

  '&:after': {
    content: '""',
    position: 'absolute',

    width: 'calc($checkbox / 2)',
    height: 'calc($checkbox / 2)',

    left: 'calc($sizes$checkbox / 4)',
    top: 'calc($sizes$checkbox / 4)',

    backgroundColor: '$accent',
    transform: 'scale(0)',

    transition: 'transform $motion',
  },

  'input:checked ~ &': {
    borderColor: '$accent',

    '&:after': {
      transform: 'scale(1)',
    },
  },

  'input:focus-visible ~ &': {
    borderColor: '$accent',
    boxShadow: '$focus',
  },
})

const Label = ({ label }: { label?: string }) => {
  if (!label) return null

  return (
    <Text css={{ ml: '$8', userSelect: 'none' }} variant="small">
      {label}
    </Text>
  )
}

export const CheckboxFilter = forwardRef<HTMLInputElement, Props>(
  function CheckboxFilter({ children: _, label, css, ...props }, ref) {
    return (
      <Holder css={css}>
        <Input ref={ref} type="checkbox" {...props} />
        <FakeElement
          aria-hidden="true"
          css={{
            borderRadius: '$sm',
            '&:after': { borderRadius: '$xs' },
          }}
        />
        <Label label={label} />
      </Holder>
    )
  }
)

export const RadioFilter = forwardRef<HTMLInputElement, Props>(
  function CheckboxFilter({ children: _, label, css, ...props }, ref) {
    return (
      <Holder css={css}>
        <Input ref={ref} type="radio" {...props} />
        <FakeElement
          aria-hidden="true"
          css={{
            borderRadius: '$full',
            '&:after': { borderRadius: '$full' },
          }}
        />
        <Label label={label} />
      </Holder>
    )
  }
)
