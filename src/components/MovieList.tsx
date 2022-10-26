import splitbee from '@splitbee/web'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'

import useDebounce from 'common/hooks/useDebounce'
import { useTranslations } from 'lib/i18n'
import { useFilters } from 'lib/store'
import { styled } from 'lib/style'

import { ListFooter } from './ListFooter'
import { MovieLoader } from './MovieLoader'
import { MovieThumb } from './MovieThumb'
import { NoMovies } from './NoMovies'
import { Button } from './UI'

export const MovieList = () => {
  const { t } = useTranslations()
  const {
    query: { id },
  } = useRouter()

  const filters = useFilters()
  const debouncedFilters = useDebounce(filters)
  const { premium, channels, genre, search, sort, year, nationalOnly } =
    debouncedFilters
  const channelsBlacklist = [...premium, ...channels]

  const fetchMovies = async ({ pageParam = 0 }) => {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        offset: pageParam,
        sort,
        search: search.length > 2 ? search : undefined,
        genre,
        channelsBlacklist:
          channelsBlacklist.length > 0 ? channelsBlacklist : null,
        minYear: year ? year : null,
        maxYear: year ? (Number(year) + 9).toString() : null,
        country: nationalOnly ? 'portugal' : null,
      }),
    })

    if (!res.ok) throw new Error('Could not fetch movies')

    return res.json()
  }

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetchedAfterMount,
  } = useInfiniteQuery<{
    movies: {
      id: number
      imdb_id: string
      poster: string
      year: string
      title: string
      rating_imdb: string | null
      rating_rotten_tomatoes: string | null
    }[]
    count: number
  }>(`movies-${JSON.stringify(debouncedFilters)}`, fetchMovies, {
    staleTime: 1000 * 60 * 15,
    getNextPageParam: (lastPage, pages) => {
      const soFar = pages.reduce((acc, p) => (acc += p.movies.length), 0)

      return soFar < lastPage.count ? soFar : undefined
    },
  })

  useEffect(() => {
    if (id && typeof id === 'string') {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [id, isFetchedAfterMount])

  if (isLoading || !data) {
    return <MovieLoader />
  }

  if (data.pages[0].count === 0) {
    return <NoMovies />
  }

  return (
    <Wrapper>
      <Grid>
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.movies.map((movie) => {
              return (
                <MovieThumb
                  key={movie.id}
                  imdbId={movie.imdb_id}
                  image={movie.poster}
                  title={movie.title}
                  year={movie.year}
                  imdbRating={movie.rating_imdb}
                  rottenRating={movie.rating_rotten_tomatoes}
                  isActive={id === movie.imdb_id}
                  isTonedDown={typeof id === 'string' && id !== movie.imdb_id}
                />
              )
            })}
          </React.Fragment>
        ))}
      </Grid>
      {!isLoading && hasNextPage && (
        <LoadMoreHolder
          css={{
            pointerEvents: isFetchingNextPage ? 'none' : undefined,
            opacity: isFetchingNextPage ? '0.5' : undefined,
          }}
        >
          <Button
            disabled={isFetchingNextPage}
            size="lg"
            onClick={() => {
              fetchNextPage()
              splitbee.track('Load more')
            }}
          >
            {isFetchingNextPage ? t('loading') : t('loadMore')}
          </Button>
        </LoadMoreHolder>
      )}
      <ListFooter />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  width: '100%',
  height: '$scroll',
  overflowY: 'auto',
  sidebarWidth: 'thin',

  p: '$8',

  '@sm': {
    p: '$16',
  },

  '@md': {
    p: '$24',
  },
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '$8',

  '@md': {
    gap: '$16',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  },
})

const LoadMoreHolder = styled('div', {
  mt: '$40',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  mb: '$40',
})
