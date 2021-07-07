import { useInfiniteQuery } from 'react-query'
import React from 'react'

import { styled } from 'lib/style'
import { useFilters } from 'lib/filters'

import { Box, Button } from './UI'
import { MovieThumb } from './MovieThumb'

const Wrapper = styled('main', {
  width: '100%',
  height: '$scroll',
  overflowY: 'auto',
  sidebarWidth: 'thin',

  p: '$24',
})

export const MovieList = () => {
  const { state } = useFilters()
  const { premium, channels, genre, search, sort, year } = state

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
        search,
        genre,
        channelsBlacklist:
          channelsBlacklist.length > 0 ? channelsBlacklist : null,
        minYear: year ? year : null,
        maxYear: year ? year + 10 : null,
      }),
    })

    if (!res.ok) throw new Error('Could not fetch movies')

    return res.json()
  }

  const { data, fetchNextPage } = useInfiniteQuery<{
    movies: {
      id: number
      poster: string
      year: string
      title: string
      rating_imdb: string | null
      rating_rotten_tomatoes: string | null
    }[]
  }>(`movies-${JSON.stringify(state)}`, fetchMovies, {
    getNextPageParam: (_, pages) => {
      return pages.reduce((acc, p) => (acc += p.movies.length), 0)
    },
  })

  return (
    <Wrapper>
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '$16',

          '@xl': {
            gridTemplateColumns: 'repeat(6, minmax(150px, 1fr))',
          },
        }}
      >
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.movies.map((movie) => {
              return (
                <MovieThumb
                  key={movie.id}
                  image={movie.poster}
                  title={movie.title}
                  year={movie.year}
                  imdbRating={movie.rating_imdb}
                  rottenRating={movie.rating_rotten_tomatoes}
                />
              )
            })}
          </React.Fragment>
        ))}
      </Box>
      <Box
        css={{
          mt: '$40',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button size="lg" onClick={() => fetchNextPage()}>
          Load more
        </Button>
      </Box>
    </Wrapper>
  )
}
