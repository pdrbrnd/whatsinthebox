import { usePlausible as useOriginalPlausible } from 'next-plausible'
import { useCallback } from 'react'

export enum PlausibleEvents {
  ShowAboutModal = 'Show About Modal',
  ShowCostModal = 'Show Cost Modal',
  BuyMeACoffee = 'Buy Me A Coffee',
  ChangeTheme = 'Change Theme',
  OpenAbout = 'Open About',
  OpenImdb = 'Open IMDB',
  LoadMore = 'Load More',
  OpenDetails = 'Open Details',
  Sort = 'Sort',
  Search = 'Search',
  SetGenre = 'Set Genre',
  SetYear = 'Set Year',
  OnlyNationalOn = 'Only National On',
  OnlyNationalOff = 'Only National Off',
  AllPremiumOff = 'All Premium Off',
  AllPremiumOn = 'All Premium On',
  AllNormalChannelsOn = 'All Normal Channels On',
  AllNormalChannelsOff = 'All Normal Channels Off',
  ChannelOn = 'Channel On',
  ChannelOff = 'Channel Off',
}

export const usePlausible = () => {
  const originalPlausible = useOriginalPlausible()

  const plausible: typeof originalPlausible = useCallback(
    (event, ...rest) => {
      if (
        [
          PlausibleEvents.BuyMeACoffee,
          PlausibleEvents.OpenAbout,
          PlausibleEvents.ShowCostModal,
        ].includes(event as PlausibleEvents)
      ) {
        originalPlausible(event, ...rest)
      }
    },
    [originalPlausible]
  )

  return plausible
}
