import { useQuery } from 'react-query'

import { styled } from 'lib/style'

import { Box } from './UI'
import { MovieThumb } from './MovieThumb'

const Wrapper = styled('main', {
  width: '100%',
  height: '$scroll',
  overflowY: 'auto',
  sidebarWidth: 'thin',

  p: '$24',
})

export const MovieList = () => {
  const { data } = useQuery<{
    movies: {
      id: number
      poster: string
      year: string
      title: string
      rating_imdb: string | null
      rating_rotten_tomatoes: string | null
    }[]
  }>('movies', async () => {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        offset: 0,
      }),
    })

    if (!res.ok) throw new Error('Could not fetch movies')

    return res.json()
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
        {data?.movies.map((movie) => {
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
      </Box>
    </Wrapper>
  )
}
