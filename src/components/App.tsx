import React, { useState } from 'react'

import { Box } from 'components/UI'
import { Topbar } from 'components/Topbar'
import { Sidebar } from 'components/Sidebar'
import { MovieList } from 'components/MovieList'
import { MovieDetails } from 'components/MovieDetails'

export const App = () => {
  const [selectedMovie, selectMovie] = useState<null | string>(null) // uses imdb ID

  return (
    <Box
      css={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Topbar />
      <Box css={{ position: 'relative', display: 'flex' }}>
        <Sidebar />
        <Box
          css={{
            width: '100%',
            paddingRight: selectedMovie ? '$sizes$details' : 0,
          }}
        >
          <MovieList onSelect={selectMovie} selectedMovie={selectedMovie} />
        </Box>
        <Box
          css={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            transition: 'transform $motion',
            width: '$details',
            transform: `translateX(${selectedMovie ? '0' : '100%'})`,
          }}
        >
          {selectedMovie && (
            <MovieDetails
              imdbId={selectedMovie}
              onClose={() => selectMovie(null)}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
