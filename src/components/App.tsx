import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useReturningUser, UserType } from 'common/hooks/useReturningUser'
import { styled } from 'lib/style'

import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { MovieDetails } from './MovieDetails'
import { AboutModal } from './AboutModal'
import { MovieList } from './MovieList'
import { CostModal } from './CostModal'

export const App = () => {
  const [modal, setModal] = useState<null | 'about' | 'cost'>(null)
  const userType = useReturningUser()
  const [sidebarMobile, setSidebarMobile] = useState(false)
  const {
    query: { id },
  } = useRouter()

  useEffect(
    function reactToUserType() {
      if (userType === UserType.FREQUENT_USER) {
        setModal('cost')
      }

      if (userType === UserType.FIRST_TIME_USER) {
        setModal('about')
      }
    },
    [userType]
  )

  const selectedMovie = typeof id === 'string'

  return (
    <>
      <CostModal
        isOpen={modal === 'cost'}
        onClose={() => {
          setModal(null)
        }}
      />
      <AboutModal
        isOpen={modal === 'about'}
        onClose={() => {
          setModal(null)
        }}
      />
      <Wrapper>
        <Topbar
          onAboutOpen={() => {
            setModal('about')
          }}
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
