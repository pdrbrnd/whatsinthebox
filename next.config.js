const { withPlausibleProxy } = require('next-plausible')
const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = withPlausibleProxy()({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            replaceAttrValues: { '#000': 'currentColor' },
          },
        },
      ],
    })

    return config
  },
})

module.exports = withSentryConfig(moduleExports, {})
