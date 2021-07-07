import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { styled } from 'lib/style'

import { Sort, Search, Info, Logo, Sun, Moon } from './Icons'
import {
  Box,
  Stack,
  Text,
  Select,
  VanillaInput,
  IconButton,
  Button,
} from './UI'

const Wrapper = styled('header', {
  backgroundColor: '$panel',
  borderBottom: '1px solid $muted',

  display: 'flex',
  alignItems: 'center',

  height: '$topbar',
})

const Left = styled('div', {
  height: '100%',
  width: '$sidebar',
  borderRight: '1px solid $muted',

  px: '$8',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Main = styled('div', {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  px: '$8',

  flex: 1,
})

export const Topbar = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Wrapper>
      <Left>
        <Stack>
          <Logo />
          <IconButton
            icon={<Info />}
            onClick={() => {
              // noop
            }}
          >
            About
          </IconButton>
        </Stack>
        {resolvedTheme && mounted && (
          <Button
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          >
            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
            </Box>
          </Button>
        )}
      </Left>
      <Main>
        <Box css={{ flex: 1 }}>
          <Box as="label" css={{ color: '$secondary' }}>
            <Stack>
              <Search />
              <VanillaInput placeholder="Search title, director, actors, writer..." />
            </Stack>
          </Box>
        </Box>
        <Stack css={{ color: '$secondary', ml: '$8' }}>
          <Text variant="caps">Sort</Text>
          <Sort />
          <Select variant="small" css={{ color: '$foreground' }}>
            <option value="imdb">IMDB</option>
            <option value="rotten">Rotten Tomatoes</option>
          </Select>
        </Stack>
      </Main>
    </Wrapper>
  )
}
