import { createContext, Dispatch, useContext, useMemo, useReducer } from 'react'

type Filters = {
  genre: null | string
  year: null | string
  search: string
  sort: 'imdb' | 'rotten'
  channels: number[]
  premium: number[]
}

type SetGenre = { type: 'SET_GENRE'; payload: Filters['genre'] }
type SetYear = { type: 'SET_YEAR'; payload: Filters['year'] }
type SetSearch = { type: 'SET_SEARCH'; payload: Filters['search'] }
type SetSort = { type: 'SET_SORT'; payload: Filters['sort'] }
type SetChannels = { type: 'SET_CHANNELS'; payload: number[] }
type ToggleChannel = { type: 'TOGGLE_CHANNEL'; payload: number }
type SetPremium = { type: 'SET_PREMIUM'; payload: number[] }
type TogglePremium = { type: 'TOGGLE_PREMIUM'; payload: number }

type Actions =
  | SetGenre
  | SetYear
  | SetSearch
  | SetSort
  | SetChannels
  | ToggleChannel
  | SetPremium
  | TogglePremium

type FiltersContextType = {
  state: Filters
  dispatch: Dispatch<Actions>
}

const initialState: Filters = {
  genre: null,
  year: null,
  search: '',
  sort: 'imdb',
  channels: [],
  premium: [],
}

const reducer = (state: Filters, action: Actions) => {
  switch (action.type) {
    case 'SET_GENRE':
      return { ...state, genre: action.payload }
    case 'SET_YEAR':
      return { ...state, year: action.payload }
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_SORT':
      return { ...state, sort: action.payload }
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload }
    case 'SET_PREMIUM':
      return { ...state, premium: action.payload }
    case 'TOGGLE_CHANNEL':
    case 'TOGGLE_PREMIUM': {
      const key = action.type === 'TOGGLE_CHANNEL' ? 'channels' : 'premium'
      const inList = state[key].includes(action.payload)

      return {
        ...state,
        [key]: inList
          ? state[key].filter((channel) => {
              return channel !== action.payload
            })
          : [...state[key], action.payload],
      }
    }
    default:
      return state
  }
}

const FiltersContext = createContext<FiltersContextType>({
  state: initialState,
  dispatch: () => {
    // noop
  },
})

export const FiltersProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])

  return (
    <FiltersContext.Provider value={contextValue}>
      {children}
    </FiltersContext.Provider>
  )
}

export const useFilters = () => {
  const filters = useContext(FiltersContext)

  if (!filters) {
    throw new Error('useFilters needs to be wrapper in a FiltersProvider')
  }

  return filters
}
