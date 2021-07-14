import { useInfiniteQuery } from 'react-query'
import React from 'react'
import { usePlausible } from 'next-plausible'
import { useRouter } from 'next/router'

import { styled } from 'lib/style'
import { useFilters } from 'lib/store'
import { useTranslations } from 'lib/i18n'
import useDebounce from 'common/hooks/useDebounce'
import { PlausibleEvents } from 'common/constants'

import { Button } from './UI'
import { MovieThumb } from './MovieThumb'
import { MovieLoader } from './MovieLoader'
import { NoMovies } from './NoMovies'

export const MovieList = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()
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

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<{
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
      getNextPageParam: (lastPage, pages) => {
        const soFar = pages.reduce((acc, p) => (acc += p.movies.length), 0)

        // offset is not the exact length of current data, but the length PLUS one (to start in the next movie)
        return soFar < lastPage.count ? soFar + 1 : undefined
      },
    })

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
              plausible(PlausibleEvents.LoadMore)
            }}
          >
            {isFetchingNextPage ? t('loading') : t('loadMore')}
          </Button>
        </LoadMoreHolder>
      )}
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
