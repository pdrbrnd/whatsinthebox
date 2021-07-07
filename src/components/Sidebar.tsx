import { styled } from 'lib/style'

import { Box, Text, Button, RadioFilter, Select, CheckboxFilter } from './UI'

const Holder = styled('aside', {
  position: 'relative',

  width: '$sidebar',
  height: '$scroll',

  flexShrink: 0,

  backgroundColor: '$panel',
  borderRight: '1px solid $muted',
})

const Inner = styled('div', {
  position: 'absolute',

  width: '100%',
  height: '100%',

  overflowY: 'auto',
  scrollbarWidth: 'thin',
})

export const Sidebar = () => {
  return (
    <Holder>
      <Inner>
        <FilterSection title="When">
          <RadioFilter disabled checked label="Last 7 days" />
        </FilterSection>
        <FilterSection title="Genre">
          <RadioFilter name="genre" value="any" label="Any Genre" />
          <RadioFilter name="genre" value="drama" label="Drama" />
          <RadioFilter name="genre" value="thriller" label="Thriller" />
          <RadioFilter name="genre" value="romance" label="Romance" />
          <RadioFilter name="genre" value="comedy" label="Comedy" />
        </FilterSection>
        <FilterSection title="Year">
          <Select>
            <option>Any year</option>
            <option>2020s</option>
            <option>2010s</option>
            <option>2000s</option>
            <option>1990s</option>
            <option>1980s</option>
            <option>1970s</option>
            <option>1960s</option>
            <option>1950s</option>
            <option>1940s</option>
            <option>1930s</option>
            <option>1920s</option>
          </Select>
        </FilterSection>
        <FilterSection
          title="Premium Channels"
          button={{
            label: 'None',
            onClick: () => {
              //
            },
          }}
        >
          <CheckboxFilter label="TVCine Top" />
          <CheckboxFilter label="TVCine Edition" />
          <CheckboxFilter label="TVCine Emotion" />
          <CheckboxFilter label="TVCine Action" />
          <CheckboxFilter label="TV Series" />
        </FilterSection>
        <FilterSection
          title="Channels"
          button={{
            label: 'None',
            onClick: () => {
              //
            },
          }}
        >
          <CheckboxFilter label="RTP 1" />
          <CheckboxFilter label="RTP 2" />
          <CheckboxFilter label="SIC" />
          <CheckboxFilter label="TVI" />
          <CheckboxFilter label="Hollywood" />
          <CheckboxFilter label="AXN" />
          <CheckboxFilter label="AXN Movies" />
          <CheckboxFilter label="AXN White" />
          <CheckboxFilter label="SyFy" />
          <CheckboxFilter label="Cinemundo" />
          <CheckboxFilter label="Fox" />
          <CheckboxFilter label="Fox Movies" />
          <CheckboxFilter label="Fox Comedy" />
          <CheckboxFilter label="Fox Life" />
          <CheckboxFilter label="Fox Crime" />
          <CheckboxFilter label="AMC" />
        </FilterSection>
      </Inner>
    </Holder>
  )
}

type FilterSectionProps = {
  title: string
  button?: {
    label: string
    onClick: () => void
  }
}
const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  button,
  children,
}) => {
  return (
    <Box css={{ pt: '$16', pb: '$8', px: '$8' }}>
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
    </Box>
  )
}
