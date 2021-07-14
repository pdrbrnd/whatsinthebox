import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { usePlausible } from 'next-plausible'

import { styled } from 'lib/style'
import { useTranslations } from 'lib/i18n'
import { useStore, useFilters, initialState } from 'lib/store'
import useDebounce from 'common/hooks/useDebounce'
import { PlausibleEvents } from 'common/constants'

import { Sort, Search, Info, Logo, Sun, Moon, Filter } from './Icons'
import {
  Box,
  Stack,
  Text,
  Select,
  VanillaInput,
  IconButton,
  Button,
} from './UI'

type TopbarProps = {
  onAboutOpen: () => void
  sidebarMobile: boolean
  setSidebarMobile: (status: boolean) => void
}

export const Topbar = ({
  onAboutOpen,
  sidebarMobile,
  setSidebarMobile,
}: TopbarProps) => {
  return (
    <Wrapper>
      <Left
        onAboutOpen={onAboutOpen}
        sidebarMobile={sidebarMobile}
        setSidebarMobile={setSidebarMobile}
      />
      <Main />
    </Wrapper>
  )
}

const Left = ({
  onAboutOpen,
  sidebarMobile,
  setSidebarMobile,
}: TopbarProps) => {
  const { t } = useTranslations()
  const plausible = usePlausible()
  const filters = useFilters()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasFilters = useMemo(() => {
    return mounted && JSON.stringify(filters) !== JSON.stringify(initialState)
  }, [mounted, filters])

  return (
    <LeftHolder>
      <Stack>
        <Logo />
        <IconButton
          icon={<Info />}
          onClick={() => {
            plausible(PlausibleEvents.OpenAbout)
            onAboutOpen()
          }}
        >
          {t('about')}
        </IconButton>
      </Stack>
      <Box css={{ display: 'flex' }}>
        <ThemeButton />

        <FilterButtonHolder>
          {hasFilters && <ActiveFiltersCircle />}
          <Button
            onClick={() => setSidebarMobile(!sidebarMobile)}
            css={{
              backgroundColor: sidebarMobile ? '$accent' : '$muted',
              color: sidebarMobile ? '$background' : '$foreground',
            }}
          >
            <Filter />
          </Button>
        </FilterButtonHolder>
      </Box>
    </LeftHolder>
  )
}

const ThemeButton = () => {
  const plausible = usePlausible()

  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!resolvedTheme || !mounted) return null

  return (
    <Button
      onClick={() => {
        const targetTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

        plausible(PlausibleEvents.ChangeTheme, {
          props: { theme: targetTheme },
        })
        setTheme(targetTheme)
      }}
    >
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
      </Box>
    </Button>
  )
}

const Main = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()

  const set = useStore((state) => state.set)
  const search = useStore((state) => state.search)
  const sort = useStore((state) => state.sort)

  const debouncedSearch = useDebounce(search)
  useEffect(() => {
    if (debouncedSearch) {
      plausible(PlausibleEvents.Search, { props: { search: debouncedSearch } })
    }
  }, [debouncedSearch, plausible])

  return (
    <MainHolder>
      <Box css={{ flex: 1 }}>
        <Box as="label" css={{ color: '$secondary' }}>
          <Stack>
            <Search />
            <VanillaInput
              placeholder={t('search.placeholder')}
              value={search}
              onChange={(e) => {
                set('search', e.currentTarget.value)
              }}
            />
          </Stack>
        </Box>
      </Box>
      <Stack css={{ color: '$secondary', ml: '$8' }}>
        <Text variant="caps">{t('sort')}</Text>
        <Sort />
        <Select
          variant="small"
          css={{ color: '$foreground' }}
          value={sort}
          onChange={(e) => {
            plausible(PlausibleEvents.Sort, {
              props: {
                value: e.currentTarget.value,
              },
            })
            set('sort', e.currentTarget.value as 'imdb' | 'rotten' | 'yearDesc')
          }}
        >
          <option value="imdb">IMDB</option>
          <option value="rotten">Rotten Tomatoes</option>
          <option value="yearDesc">{t('sort.year.desc')}</option>
        </Select>
      </Stack>
    </MainHolder>
  )
}

const Wrapper = styled('header', {
  backgroundColor: '$panel',
  borderBottom: '1px solid $muted',

  display: 'flex',
  alignItems: 'center',

  height: '$topbar',
})

const LeftHolder = styled('div', {
  height: '100%',

  px: '$8',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  width: '100%',

  '@md': {
    width: '$sidebar',
  },
})

const MainHolder = styled('div', {
  display: 'none',

  '@md': {
    borderLeft: '1px solid $muted',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    px: '$8',

    flex: 1,
  },
})

const FilterButtonHolder = styled('div', {
  position: 'relative',
  ml: '$8',

  '@md': { display: 'none' },
})

const ActiveFiltersCircle = styled('div', {
  position: 'absolute',
  top: 'calc($space$8 / 2 * -1)',
  right: 'calc($space$8 / 2 * -1)',
  backgroundColor: '#ff5050',
  width: '$space$8',
  height: '$space$8',
  borderRadius: '$full',
  zIndex: '$1',
})
