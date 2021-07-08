import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

const FILTERS_STORAGE_KEY = '__witb_filters__'

type Filters = {
  genre: null | string
  year: null | string
  search: string
  sort: 'imdb' | 'rotten'
  channels: number[]
  premium: number[]
  nationalOnly: boolean
}

type Hydrate = { type: 'HYDRATE'; payload: Filters }
type SetGenre = { type: 'SET_GENRE'; payload: Filters['genre'] }
type SetYear = { type: 'SET_YEAR'; payload: Filters['year'] }
type SetSearch = { type: 'SET_SEARCH'; payload: Filters['search'] }
type SetSort = { type: 'SET_SORT'; payload: Filters['sort'] }
type SetChannels = { type: 'SET_CHANNELS'; payload: number[] }
type ToggleChannel = { type: 'TOGGLE_CHANNEL'; payload: number }
type SetPremium = { type: 'SET_PREMIUM'; payload: number[] }
type TogglePremium = { type: 'TOGGLE_PREMIUM'; payload: number }
type ToggleNationalOnly = { type: 'TOGGLE_NATIONAL' }

type Actions =
  | SetGenre
  | SetYear
  | SetSearch
  | SetSort
  | SetChannels
  | ToggleChannel
  | SetPremium
  | TogglePremium
  | Hydrate
  | ToggleNationalOnly

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
  nationalOnly: false,
}

const reducer = (state: Filters, action: Actions): Filters => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...action.payload, search: '' }
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
    case 'TOGGLE_NATIONAL':
      return { ...state, nationalOnly: !state.nationalOnly }
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

  useEffect(function hydrate() {
    const prevFilters = localStorage.getItem(FILTERS_STORAGE_KEY)

    if (prevFilters) {
      dispatch({ type: 'HYDRATE', payload: JSON.parse(prevFilters) })
    }
  }, [])

  useEffect(
    function sync() {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(state))
    },
    [state]
  )

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
