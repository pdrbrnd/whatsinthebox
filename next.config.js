const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
  sentry: {
    hideSourceMaps: true,
  },
  async rewrites() {
    return [
      {
        source: '/script.js',
        destination: 'https://cdn.splitbee.io/sb.js',
      },
      {
        source: '/_witb/:slug',
        destination: 'https://hive.splitbee.io/:slug',
      },
    ]
  },
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
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
