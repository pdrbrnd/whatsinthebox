import React from 'react'

import { Box } from 'components/UI'
import { Topbar } from 'components/Topbar'
import { Sidebar } from 'components/Sidebar'
import { MovieList } from 'components/MovieList'

export const App = () => (
  <Box
    css={{
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
    }}
  >
    <Topbar />
    <Box css={{ display: 'flex' }}>
      <Sidebar />
      <MovieList />
    </Box>
  </Box>
)
