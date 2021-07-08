import { usePlausible } from 'next-plausible'

import { BigLogo, Coffee } from './Icons'
import { Box, Text, CloseButton, Button, Stack } from './UI'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AboutModal = ({ isOpen, onClose }: Props) => {
  const plausible = usePlausible()

  if (!isOpen) return null

  return (
    <Box
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
        css={{
          background: '$panel',
          border: '1px solid $muted',
          width: '520px',
          borderRadius: '$md',
        }}
      >
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid $muted',
            p: '$16 $24',
          }}
        >
          <Text>About</Text>
          <CloseButton onClick={onClose} />
        </Box>
        <Box css={{ p: '$16 $24' }}>
          <Text variant="huge">
            Find good movies from the last se7en days of Portuguese television.
          </Text>
          <Text variant="big" css={{ fontWeight: '$medium', mt: '$24' }}>
            Sort by IMDb or Rotten Tomatoes rating, filter by genre, or go crazy
            and search for movies, directors or actors.
          </Text>
          <Box
            css={{
              color: '$accent',
              mt: '$40',
              mx: 'calc($40 * -2)',
              svg: { width: '100%' },
            }}
          >
            <BigLogo />
          </Box>
        </Box>
        <Box
          css={{
            mt: '$40',
            borderTop: '1px solid $muted',
            p: '$16 $24',
            pb: '$24',
            color: '$secondary',
          }}
        >
          <Text variant="small" css={{ fontWeight: '$medium' }}>
            This app was made for fun, but every small donation is very much
            appreciated and helps supporting ongoing costs.
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
