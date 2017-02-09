// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.
export default {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: (config) => ({
    compiler_public_path: `/`,
    proxy: {
      enabled: false,
      options: {
        host: 'http://localhost:8000',
        match: /^\/api\/.*/
      }
    },
    applicationConfig: {
      "api.entry": "http://api.casino.app",
      "middlewares.persist.keyPrefix": "nas:",
      "middlewares.persist.whitelist[0]": "auth",
      "middlewares.unauthorized[0]": 401,
      "middlewares.unauthorized[1]": 403,
      "nas.currencies.base": "EUR",
      "nas.currencies.supported[0]": "EUR",
      "nas.currencies.supported[1]": "USD",
      "nas.currencies.supported[2]": "SEK",
      "nas.currencies.supported[3]": "NOK",
      "nas.departments[0]": "PLAYER",
      "nas.departments[1]": "CS",
      "nas.departments[2]": "RFP",
      "nas.departments[3]": "MARKETING",
      "validation.password": "/^(?=[^\\s]*\\d)[^\\s]{6,20}$/g"
    }
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (config) => ({
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: null,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    }
  })
}
