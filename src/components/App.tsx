import React, { useState } from 'react'

import { Box } from 'components/UI'
import { Topbar } from 'components/Topbar'
import { Sidebar } from 'components/Sidebar'
import { MovieList } from 'components/MovieList'
import { MovieDetails } from 'components/MovieDetails'
import { AboutModal } from 'components/AboutModal'
import { useAboutModal } from 'common/hooks/useAboutModal'

export const App = () => {
  const { isOpen, onOpen, onClose } = useAboutModal()
  const [selectedMovie, selectMovie] = useState<null | string>(null) // uses imdb ID
  const [sidebarMobile, setSidebarMobile] = useState(false)

  return (
    <>
      <AboutModal isOpen={isOpen} onClose={onClose} />
      <Box
        css={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Topbar
          onAboutOpen={onOpen}
          sidebarMobile={sidebarMobile}
          setSidebarMobile={setSidebarMobile}
        />
        <Box css={{ position: 'relative', display: 'flex' }}>
          <Sidebar
            isVisibleMobile={sidebarMobile}
            onMobileClose={() => setSidebarMobile(false)}
          />
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
              transform: `translateX(${selectedMovie ? '0' : '100%'})`,

              width: '100%',

              '@md': {
                width: '$details',
              },
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
    </>
  )
}
