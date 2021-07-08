import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import ContentLoader from 'react-content-loader'
import { usePlausible } from 'next-plausible'

import { styled, CSS } from 'lib/style'
import { useFilters } from 'lib/filters'
import { useTranslations } from 'lib/i18n'
import useDebounce from 'common/hooks/useDebounce'

import { Search } from './Icons'
import {
  Box,
  Text,
  Button,
  RadioFilter,
  Select,
  CheckboxFilter,
  Input,
} from './UI'

const Holder = styled('aside', {
  width: '$sidebar',
  height: '$scroll',

  flexShrink: 0,

  backgroundColor: '$panel',
  borderRight: '1px solid $muted',

  position: 'absolute',
  zIndex: '$3',

  transition: 'transform $motion',

  '@md': {
    position: 'relative',
  },
})

const Inner = styled('div', {
  position: 'absolute',

  width: '100%',
  height: '100%',

  overflowY: 'auto',
  scrollbarWidth: 'thin',
})

type Props = {
  isVisibleMobile: boolean
  onMobileClose: () => void
}
export const Sidebar = ({ isVisibleMobile, onMobileClose }: Props) => {
  return (
    <>
      {isVisibleMobile && (
        <Box
          onClick={() => onMobileClose()}
          css={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',

            zIndex: '$2',
            '@md': {
              display: 'none',
            },
          }}
        />
      )}
      <Holder
        css={{
          transform: `translateX(${isVisibleMobile ? '0' : '-100%'})`,

          '@md': {
            transform: 'none',
          },
        }}
      >
        <Inner>
          <MobileSort />
          <MobileSearch />
          <Genre />
          <National />
          <Year />
          <Channels />
        </Inner>
      </Holder>
    </>
  )
}

/**
 * Sort (Mobile Only)
 */

const MobileSort = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()
  const { state, dispatch } = useFilters()

  return (
    <FilterSection
      title={t('sort')}
      css={{
        '@md': { display: 'none' },
      }}
    >
      <Select
        variant="small"
        css={{ color: '$foreground' }}
        value={state.sort}
        onChange={(e) => {
          plausible('sort', {
            props: {
              value: e.currentTarget.value,
            },
          })
          dispatch({
            type: 'SET_SORT',
            payload: e.currentTarget.value as 'imdb' | 'rotten',
          })
        }}
      >
        <option value="imdb">IMDB</option>
        <option value="rotten">Rotten Tomatoes</option>
      </Select>
    </FilterSection>
  )
}

/**
 * Search (mobile only)
 */

const MobileSearch = () => {
  const { t } = useTranslations()
  const { state, dispatch } = useFilters()
  const [search, setSearch] = useState(state.search)
  const debouncedSearch = useDebounce(search)

  useEffect(
    function commitSearch() {
      dispatch({ type: 'SET_SEARCH', payload: debouncedSearch })
    },
    [dispatch, debouncedSearch]
  )

  return (
    <FilterSection
      title={t('search')}
      css={{
        '@md': { display: 'none' },
      }}
    >
      <Box css={{ position: 'relative' }}>
        <Box
          css={{
            position: 'absolute',
            left: '$8',
            top: '50%',
            transform: 'translateY(-45%)',
            color: '$secondary',
          }}
        >
          <Search />
        </Box>
        <Input
          css={{ pl: '$28' }}
          placeholder={t('search.placeholder.short')}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
        />
      </Box>
    </FilterSection>
  )
}

/**
 * Genres
 */

const Genre = () => {
  const { t } = useTranslations()
  const genres = [
    { label: t('genre.action'), value: 'Action' },
    { label: t('genre.adventure'), value: 'Adventure' },
    { label: t('genre.comedy'), value: 'Comedy' },
    { label: t('genre.crime'), value: 'Crime' },
    { label: t('genre.documentary'), value: 'Documentary' },
    { label: t('genre.drama'), value: 'Drama' },
    { label: t('genre.history'), value: 'History' },
    { label: t('genre.horror'), value: 'Horror' },
    { label: t('genre.musical'), value: 'Musical' },
    { label: t('genre.romance'), value: 'Romance' },
    { label: t('genre.scifi'), value: 'Sci-Fi' },
    { label: t('genre.sport'), value: 'Sport' },
    { label: t('genre.thriller'), value: 'Thriller' },
    { label: t('genre.war'), value: 'War' },
    { label: t('genre.western'), value: 'Western' },
  ]

  const plausible = usePlausible()
  const { dispatch, state } = useFilters()

  return (
    <FilterSection title={t('genre')}>
      <RadioFilter
        name="genre"
        value="any"
        label={t('genre.any')}
        checked={!state.genre}
        onChange={() => {
          plausible('genre', { props: { genre: null } })
          dispatch({ type: 'SET_GENRE', payload: null })
        }}
      />
      {genres.map((genre) => (
        <RadioFilter
          key={genre.value}
          name="genre"
          value={genre.value}
          label={genre.label}
          checked={state.genre === genre.value}
          onChange={() => {
            plausible('genre', { props: { genre: genre.value } })
            dispatch({ type: 'SET_GENRE', payload: genre.value })
          }}
        />
      ))}
    </FilterSection>
  )
}

/**
 * National
 */
const National = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()
  const { dispatch, state } = useFilters()

  return (
    <FilterSection title={t('country')}>
      <CheckboxFilter
        checked={state.nationalOnly}
        onChange={(e) => {
          plausible('national', {
            props: { onlyNational: e.currentTarget.checked },
          })
          dispatch({ type: 'TOGGLE_NATIONAL' })
        }}
        label={t('portugueseMovies')}
      />
    </FilterSection>
  )
}
/**
 * Years
 */
const years = [
  { label: '2020s', value: '2020' },
  { label: '2010s', value: '2010' },
  { label: '2000s', value: '2000' },
  { label: '1990s', value: '1990' },
  { label: '1980s', value: '1980' },
  { label: '1970s', value: '1970' },
  { label: '1960s', value: '1960' },
  { label: '1950s', value: '1950' },
  { label: '1940s', value: '1940' },
  { label: '1930s', value: '1930' },
  { label: '1920s', value: '1920' },
]

const Year = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()
  const { dispatch, state } = useFilters()

  return (
    <FilterSection title={t('year')}>
      <Select
        value={!state.year ? 'any' : state.year}
        onChange={(e) => {
          plausible('year', { props: { year: e.currentTarget.value } })
          dispatch({ type: 'SET_YEAR', payload: e.currentTarget.value })
        }}
      >
        <option value="any">{t('year.any')}</option>
        {years.map((year) => (
          <option key={year.value} value={year.value}>
            {year.label}
          </option>
        ))}
      </Select>
    </FilterSection>
  )
}

/**
 * Channels
 */
const Channels = () => {
  const { t } = useTranslations()
  const plausible = usePlausible()
  const { state, dispatch } = useFilters()
  const { data, isLoading } = useQuery<{
    channels: {
      id: number
      is_premium: boolean
      name: string
    }[]
  }>('channels', async () => {
    const res = await fetch('/api/channels')

    if (!res.ok) throw new Error('Could not fetch channels')

    return res.json()
  })

  const premium = useMemo(() => {
    return data?.channels.filter((c) => c.is_premium) || []
  }, [data])
  const channels = useMemo(() => {
    return data?.channels.filter((c) => !c.is_premium) || []
  }, [data])

  if (isLoading) {
    return (
      <FilterSection title={t('channels')}>
        <ContentLoader
          uniqueKey="channelsLoader"
          width={200}
          height={75}
          backgroundColor="hsla(220, 10%, 50%, 0.1)"
          foregroundColor="hsla(220, 10%, 50%, 0.05)"
        >
          <rect x="8" y="10" width="200" height="15" />
          <rect x="8" y="35" width="170" height="15" />
          <rect x="8" y="60" width="180" height="15" />
        </ContentLoader>
      </FilterSection>
    )
  }

  return (
    <>
      {premium.length > 0 && (
        <FilterSection
          title={t('channels.premium')}
          button={{
            label:
              state.premium.length < premium.length
                ? t('channels.none')
                : t('channels.all'),
            onClick: () => {
              plausible('all premium', {
                props: {
                  value: state.premium.length < premium.length ? 'None' : 'All',
                },
              })
              dispatch({
                type: 'SET_PREMIUM',
                payload:
                  state.premium.length < premium.length
                    ? premium.map((c) => c.id)
                    : [],
              })
            },
          }}
        >
          {premium.map((channel) => (
            <CheckboxFilter
              key={channel.id}
              checked={!state.premium.includes(channel.id)}
              onChange={(e) => {
                plausible('premium channel', {
                  props: {
                    channel: channel.id,
                    channelName: channel.name,
                    checked: e.currentTarget.checked,
                  },
                })
                dispatch({ type: 'TOGGLE_PREMIUM', payload: channel.id })
              }}
              label={channel.name}
            />
          ))}
        </FilterSection>
      )}
      {channels.length > 0 && (
        <FilterSection
          title={t('channels')}
          button={{
            label:
              state.channels.length < channels.length
                ? t('channels.none')
                : t('channels.all'),
            onClick: () => {
              plausible('all channels', {
                props: {
                  value:
                    state.channels.length < channels.length ? 'None' : 'All',
                },
              })
              dispatch({
                type: 'SET_CHANNELS',
                payload:
                  state.channels.length < channels.length
                    ? channels.map((c) => c.id)
                    : [],
              })
            },
          }}
        >
          {channels.map((channel) => (
            <CheckboxFilter
              key={channel.id}
              label={channel.name}
              checked={!state.channels.includes(channel.id)}
              onChange={(e) => {
                plausible('channel', {
                  props: {
                    channel: channel.id,
                    channelName: channel.name,
                    checked: e.currentTarget.checked,
                  },
                })
                dispatch({ type: 'TOGGLE_CHANNEL', payload: channel.id })
              }}
            />
          ))}
        </FilterSection>
      )}
    </>
  )
}

type FilterSectionProps = {
  title: string
  button?: {
    label: string
    onClick: () => void
  }
  css?: CSS
}

const FilterSectionHolder = styled('div', {
  pt: '$16',
  pb: '$8',
  px: '$8',
})
const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  button,
  children,
  css,
}) => {
  return (
    <FilterSectionHolder css={css}>
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          pb: '$8',
          px: '$8',
        }}
      >
        <Text variant="caps" css={{ color: '$secondary' }}>
          {title}
        </Text>
        {button && (
          <Button size="sm" onClick={button.onClick}>
            {button.label}
          </Button>
        )}
      </Box>
      {children}
    </FilterSectionHolder>
  )
}
