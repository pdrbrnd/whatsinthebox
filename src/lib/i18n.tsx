import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Locales = 'en' | 'pt'

const en = {
  'document.title':
    'Find good movies from the last 7 days of Portuguese television',
  about: 'About',
  'about.title':
    'Find good movies from the last se7en days of Portuguese television.',
  'about.description':
    'Sort by IMDb or Rotten Tomatoes rating, filter by genre, or go crazy and search for movies, directors or actors.',
  'about.footer':
    'This app was made for fun, but every small donation is very much appreciated and helps supporting ongoing costs.',
  search: 'Search',
  'search.placeholder': 'Search title, director, actors, writer...',
  'search.placeholder.short': 'Search movies',
  sort: 'Sort',
  genre: 'Genre',
  'genre.any': 'Any genre',
  'genre.action': 'Action',
  'genre.adventure': 'Adventure',
  'genre.animation': 'Animation',
  'genre.comedy': 'Comedy',
  'genre.crime': 'Crime',
  'genre.documentary': 'Documentary',
  'genre.drama': 'Drama',
  'genre.family': 'Family',
  'genre.history': 'History',
  'genre.horror': 'Horror',
  'genre.musical': 'Musical',
  'genre.romance': 'Romance',
  'genre.scifi': 'Sci-Fi',
  'genre.sport': 'Sport',
  'genre.thriller': 'Thriller',
  'genre.war': 'War',
  'genre.western': 'Western',
  country: 'Country',
  portugueseMovies: 'Portuguese movies',
  year: 'Year',
  'year.any': 'Any Year',
  channels: 'Channels',
  'channels.premium': 'Premium Channels',
  'channels.none': 'None',
  'channels.all': 'All',
  'notFound.title': `Nothing's here`,
  'notFound.text': 'Try updating your filters',
  loadMore: 'Load more',
  loading: 'Loading...',
  schedules: 'Schedules',
  'schedules.title': 'Title',
  'schedules.channel': 'Channel',
  'schedules.date': 'Date',
  'schedules.time': 'Time',
  runtime: 'Runtime',
  director: 'Director',
  actors: 'Actors',
  writer: 'Writer',
  language: 'Language',
  openImdb: 'Open in IMDb',
} as const

type Translation = Record<keyof typeof en, string>
const pt: Translation = {
  'document.title': 'Os últimos 7 dias de bons filmes na televisão Portuguesa',
  about: 'Sobre',
  'about.title':
    'Encontra bons filmes nos últimos 7 dias da televisão Portuguesa.',
  'about.description':
    'Orderna por avaliação IMDb ou Rotten Tomatoes, filtra por categoria, ou pesquisa por títulos, realizadores ou actores.',
  'about.footer':
    'Esta aplicação foi feita por diversão, mas qualquer ajuda é muito apreciada e ajuda a suportar custos correntes.',
  'search.placeholder': 'Procurar título, realizador, actores, escritor...',
  'search.placeholder.short': 'Pesquisar filmes',
  search: 'Pesquisar',
  sort: 'Ordenar',
  genre: 'Categoria',
  'genre.any': 'Todas categorias',
  'genre.action': 'Acção',
  'genre.adventure': 'Aventura',
  'genre.animation': 'Animação',
  'genre.comedy': 'Comédia',
  'genre.crime': 'Crime',
  'genre.documentary': 'Documentário',
  'genre.drama': 'Drama',
  'genre.family': 'Familiar',
  'genre.history': 'História',
  'genre.horror': 'Horror',
  'genre.musical': 'Musical',
  'genre.romance': 'Romance',
  'genre.scifi': 'Ficção Científica',
  'genre.sport': 'Desporto',
  'genre.thriller': 'Thriller',
  'genre.war': 'Guerra',
  'genre.western': 'Western',
  country: 'País',
  portugueseMovies: 'Filmes Portugueses',
  year: 'Ano',
  'year.any': 'Qualquer ano',
  channels: 'Canais',
  'channels.premium': 'Canais Premium',
  'channels.none': 'Nenhum',
  'channels.all': 'Todos',
  'notFound.title': 'Nada aqui',
  'notFound.text': 'Tenta alterar os filtros',
  loadMore: 'Carregar mais',
  loading: 'A carregar...',
  schedules: 'Horários',
  'schedules.title': 'Título',
  'schedules.channel': 'Canal',
  'schedules.date': 'Data',
  'schedules.time': 'Hora',
  runtime: 'Tempo',
  director: 'Realizador',
  actors: 'Actores',
  writer: 'Escritor',
  language: 'Língua',
  openImdb: 'Abrir no IMDb',
}

const messages: Record<Locales, Translation> = { en, pt }

const translate = (
  locale: keyof typeof messages,
  key: keyof typeof en,
  values: Record<string, string> = {}
) => {
  const strings = messages[locale]

  if (!strings[key]) return key

  const message = strings[key]

  const pattern = /\{\{(.*?)\}\}/gim
  const matches = message.match(pattern)
  const parts = message.split(pattern)

  if (!matches) {
    return message
  }

  for (const match of matches) {
    const matchName = match.replace(/\{\{|\}\}/gim, '')
    if (!values[matchName]) {
      values[matchName] = matchName
    }
  }

  const elements = parts.map((part) => {
    return values[part] || part
  })

  return Array.isArray(elements) ? elements.join('') : elements
}

type TranslationsContextType = {
  t: (key: keyof typeof en, values?: Record<string, string>) => string
}

const TranslationsContext = createContext<TranslationsContextType>({
  t: () => '',
})

export const TranslationsProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState<Locales>('en')

  useEffect(() => {
    const targetLang = navigator.language.split('-')[0]

    if (targetLang === 'pt') setLocale('pt')
  }, [])

  const t = useMemo(() => {
    return translate.bind(null, locale)
  }, [locale])

  return (
    <TranslationsContext.Provider value={{ t }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export const useTranslations = () => {
  const ctx = useContext(TranslationsContext)

  if (!ctx) throw new Error('useTranslations needs a TranslationsProvider')

  return ctx
}
