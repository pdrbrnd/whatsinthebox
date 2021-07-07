import { styled } from 'lib/style'

import { Info, Logo, Sort, Search } from './Icons'
import { Box, Stack, Text, IconButton, Select, VanillaInput } from './UI'

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
  return (
    <Wrapper>
      <Left>
        <Logo />
        <IconButton
          css={{ ml: '$8' }}
          icon={<Info />}
          onClick={() => {
            // noop
          }}
        >
          About
        </IconButton>
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
