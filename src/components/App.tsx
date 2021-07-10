import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { useAboutModal } from 'common/hooks/useAboutModal'
import { styled } from 'lib/style'

import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { MovieDetails } from './MovieDetails'
import { AboutModal } from './AboutModal'
import { MovieList } from './MovieList'

export const App = () => {
  const { isOpen, onOpen, onClose } = useAboutModal()
  const [sidebarMobile, setSidebarMobile] = useState(false)
  const {
    query: { id },
  } = useRouter()

  const selectedMovie = typeof id === 'string'

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
            <MovieList />
          </ListHolder>

          <DetailsHolder
            css={{
              transform: `translateX(${selectedMovie ? '0' : '100%'})`,
            }}
          >
            {selectedMovie && <MovieDetails />}
          </DetailsHolder>
        </Main>
      </Wrapper>
    </>
  )
}

const Wrapper = styled('div', {
  height: '$vh',
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
