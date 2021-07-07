import React from 'react'

import { Box, Stack, CheckboxFilter, RadioFilter, Select } from 'components/UI'

const IndexPage: React.FC = () => (
  <Box css={{ maxWidth: '600px', p: '$16', backgroundColor: '$panel' }}>
    <Stack direction="vertical" css={{ alignItems: 'stretch' }}>
      <CheckboxFilter label="Testing" />
      <RadioFilter name="sex" value="male" label="Male" />
      <RadioFilter name="sex" value="female" label="Female" />

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
      <Select variant="caps">
        <option>IMDB</option>
        <option>Rotten Tomatoes</option>
      </Select>
    </Stack>
  </Box>
)

export default IndexPage
