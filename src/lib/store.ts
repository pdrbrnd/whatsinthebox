import create from 'zustand'
import shallow from 'zustand/shallow'
import { persist } from 'zustand/middleware'

export const initialState: StoreState = {
  sort: 'imdb',
  search: '',
  genre: null,
  nationalOnly: false,
  year: null,
  premium: [],
  channels: [],
}

type StoreState = {
  sort: 'imdb' | 'rotten' | 'yearDesc'
  search: string
  genre: null | string
  nationalOnly: boolean
  year: null | string
  premium: number[]
  channels: number[]
}

type StoreFunctions = {
  set: <T extends keyof typeof initialState>(
    key: T,
    value: StoreState[T]
  ) => void
  toggleChannel: (type: 'premium' | 'normal', id: number) => void
}

export const useStore = create<StoreState & StoreFunctions>(
  persist(
    (set) => ({
      ...initialState,
      set: (key, value) => set((state) => ({ ...state, [key]: value })),
      toggleChannel: (type, id) =>
        set((state) => {
          const key = type === 'normal' ? 'channels' : 'premium'
          const inList = state[key].includes(id)

          return {
            ...state,
            [key]: inList
              ? state[key].filter((channel) => channel !== id)
              : [...state[key], id],
          }
        }),
    }),
    {
      name: '___witb_persisted_store___',
      blacklist: ['search', 'set', 'toggleChannel'],
    }
  )
)

export const useFilters = (): StoreState => {
  const state = useStore(
    (state) => ({
      sort: state.sort,
      search: state.search,
      genre: state.genre,
      nationalOnly: state.nationalOnly,
      year: state.year,
      premium: state.premium,
      channels: state.channels,
    }),
    shallow
  )

  return state
}
