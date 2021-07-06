import React from 'react'

import { Box, Text } from 'components/UI'

const IndexPage: React.FC = () => (
  <Box css={{ maxWidth: '600px' }}>
    <Box css={{ mb: '$8' }}>
      <Text variant="tiny">1984</Text>
    </Box>
    <Box css={{ mb: '$8' }}>
      <Text variant="caps">Genre</Text>
    </Box>
    <Box css={{ mb: '$8' }}>
      <Text variant="small">
        Stanley Kubrick (screenplay by), Michael Herr (screenplay by), Gustav
        Hasford (screenplay by), Gustav Hasford (based on the novel The Short
        Timers by)
      </Text>
    </Box>
    <Box css={{ mb: '$8' }}>
      <Text variant="body">
        A pragmatic U.S. Marine observes the dehumanizing effects the Vietnam
        War has on his fellow recruits from their brutal boot camp training to
        the bloody street fighting in Hue.
      </Text>
    </Box>
    <Box css={{ mb: '$8' }}>
      <Text variant="big">
        Sort by IMDb or Rotten Tomatoes rating, filter by genre, or go crazy and
        search for movies, directors or actors.
      </Text>
    </Box>
    <Box css={{ mb: '$8' }}>
      <Text variant="title">Full Metal Jacket</Text>
    </Box>
    <Box css={{ mb: '$8' }}>
      <Text variant="huge">
        Find good movies from the last se7en days of Portuguese television.{' '}
      </Text>
    </Box>
  </Box>
)

export default IndexPage
