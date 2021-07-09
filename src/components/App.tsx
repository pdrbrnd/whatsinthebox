import React, { useState } from 'react'

import { useAboutModal } from 'common/hooks/useAboutModal'
import { styled } from 'lib/style'

import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { MovieDetails } from './MovieDetails'
import { AboutModal } from './AboutModal'
import { MovieList } from './MovieList'

export const App = () => {
  const { isOpen, onOpen, onClose } = useAboutModal()
  const [selectedMovie, selectMovie] = useState<null | string>(null) // uses imdb ID
  const [sidebarMobile, setSidebarMobile] = useState(false)

  return (
    <>
      <AboutModal isOpen={isOpen} onClose={onClose} />
      <Wrapper>
        <Topbar
          onAboutOpen={onOpen}
          sidebarMobile={sidebarMobile}
          setSidebarMobile={setSidebarMobile}
        />

        <Main>
          <Sidebar
            isVisibleMobile={sidebarMobile}
            onMobileClose={() => setSidebarMobile(false)}
          />

          <ListHolder
            css={{ paddingRight: selectedMovie ? '$sizes$details' : 0 }}
          >
            <MovieList onSelect={selectMovie} selectedMovie={selectedMovie} />
          </ListHolder>

          <DetailsHolder
            css={{
              transform: `translateX(${selectedMovie ? '0' : '100%'})`,
            }}
          >
            {selectedMovie && (
              <MovieDetails
                imdbId={selectedMovie}
                onClose={() => selectMovie(null)}
              />
            )}
          </DetailsHolder>
        </Main>
      </Wrapper>
    </>
  )
}

const Wrapper = styled('div', {
  height: '100vh',
  width: '100%',
  overflow: 'hidden',
})

const Main = styled('main', {
  position: 'relative',
  display: 'flex',
})

const ListHolder = styled('div', {
  width: '100%',
})

const DetailsHolder = styled('div', {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  transition: 'transform $motion',

  width: '100%',

  '@md': {
    width: '$details',
  },
})
