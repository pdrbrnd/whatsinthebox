export interface Channel {
  id: string
  name: string
  category: string
  isPremium: boolean
}

export interface Program {
  title: string
  description: string
  startTime: string
  endTime: string
  duration: number
  series?: Record<string, unknown>
}

export type Movie = Omit<Program, 'series'> & {
  imdbId: string | null
}

export interface OmdbResponse {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}
