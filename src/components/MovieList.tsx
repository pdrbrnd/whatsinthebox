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
  return (
    <Wrapper>
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '$16',
        }}
      >
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
        <MovieThumb
          image="https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
          title="La vita è bella"
          year="1997"
          imdbRating="8.6"
          rottenRating="80%"
        />
      </Box>
    </Wrapper>
  )
}
