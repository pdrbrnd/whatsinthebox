import React from 'react'

import { Box } from 'components/UI'
import { Topbar } from 'components/Topbar'
import { Sidebar } from 'components/Sidebar'

const IndexPage: React.FC = () => (
  <Box>
    <Topbar />
    <Box
      css={{
        display: 'flex',
      }}
    >
      <Sidebar />
      <main />
    </Box>
  </Box>
)

export default IndexPage
