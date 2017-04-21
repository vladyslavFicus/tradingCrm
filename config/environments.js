// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.

const applicationConfig = {
  'api.entry': 'http://api.casino.app',
  'nas.locale.defaultLanguage': 'en',
  'nas.locale.languages[0].value': 'en',
  'nas.locale.languages[0].label': 'ENG',
  'nas.locale.languages[1].value': 'ru',
  'nas.locale.languages[1].label': 'RUS',
  'components.Currency.currencies.EUR.symbol': '\u20ac',
  'components.Currency.currencies.EUR.symbolOnLeft': true,
  'components.Currency.currencies.GBP.symbol': '\u00a3',
  'components.Currency.currencies.GBP.symbolOnLeft': true,
  'components.Currency.currencies.NOK.symbol': 'kr',
  'components.Currency.currencies.NOK.symbolOnLeft': false,
  'components.Currency.currencies.RUB.symbol': '\u20bd',
  'components.Currency.currencies.RUB.symbolOnLeft': true,
  'components.Currency.currencies.SEK.symbol': 'kr',
  'components.Currency.currencies.SEK.symbolOnLeft': false,
  'components.Currency.currencies.UAH.symbol': '\u20b4',
  'components.Currency.currencies.UAH.symbolOnLeft': true,
  'components.Currency.currencies.USD.symbol': '$',
  'components.Currency.currencies.USD.symbolOnLeft': true,
  'middlewares.persist.keyPrefix': 'nas:',
  'middlewares.persist.whitelist[0]': 'auth',
  'middlewares.persist.whitelist[1]': 'userPanels',
  'middlewares.persist.whitelist[2]': 'language',
  'middlewares.unauthorized[0]': 401,
  'nas.currencies.base': 'EUR',
  'nas.currencies.supported[0]': 'EUR',
  'nas.currencies.supported[1]': 'USD',
  'nas.currencies.supported[2]': 'SEK',
  'nas.currencies.supported[3]': 'NOK',
  'nas.departments[0]': 'PLAYER',
  'nas.departments[1]': 'CS',
  'nas.departments[2]': 'RFP',
  'nas.departments[3]': 'MARKETING',
  'nas.roles[0]': 'ROLE1',
  'nas.roles[1]': 'ROLE2',
  'nas.roles[2]': 'ROLE3',
  'nas.roles[3]': 'ROLE4',
  'nas.tags.priorities.negative.tag1.departments[0]': 'CS',
  'nas.tags.priorities.negative.tag2.departments[0]': 'CS',
  'nas.tags.priorities.negative.tag2.departments[1]': 'RFP',
  'nas.tags.priorities.negative.tag3.departments[0]': 'RFP',
  'nas.tags.priorities.negative.tag3.departments[1]': 'MARKETING',
  'nas.tags.priorities.negative.tag4.departments[0]': 'CS',
  'nas.tags.priorities.negative.tag4.departments[1]': 'RFP',
  'nas.tags.priorities.negative.tag4.departments[2]': 'MARKETING',
  'nas.tags.priorities.neutral.tag1.departments[0]': 'CS',
  'nas.tags.priorities.neutral.tag1.departments[1]': 'RFP',
  'nas.tags.priorities.neutral.tag1.departments[2]': 'MARKETING',
  'nas.tags.priorities.neutral.tag2.departments[0]': 'CS',
  'nas.tags.priorities.neutral.tag4.departments[0]': 'CS',
  'nas.tags.priorities.positive.tag1.departments[0]': 'CS',
  'nas.tags.priorities.positive.tag2.departments[0]': 'RFP',
  'nas.tags.priorities.positive.tag3.departments[0]': 'CS',
  'nas.tags.priorities.positive.tag3.departments[1]': 'MARKETING',
  'nas.validation.password': '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$',
  'nas.reasons.rejection[0]': 'Reason 1',
  'nas.reasons.rejection[1]': 'Reason 2',
  'nas.reasons.rejection[2]': 'Reason 3',
  'nas.reasons.rejection[3]': 'Reason 4',
  'nas.reasons.chargeback[0]': 'Chargeback Reason 1',
  'nas.reasons.chargeback[1]': 'Chargeback Reason 2',
  'nas.reasons.chargeback[2]': 'Chargeback Reason 3',
  'nas.reasons.chargeback[3]': 'Chargeback Reason 4',
  'nas.limits.deposit.periods[0]': '24 HOURS',
  'nas.limits.deposit.periods[1]': '7 DAYS',
  'nas.limits.deposit.periods[2]': '30 DAYS',
  'nas.limits.wager.periods[0]': '24 HOURS',
  'nas.limits.wager.periods[1]': '7 DAYS',
  'nas.limits.wager.periods[2]': '30 DAYS',
  'nas.limits.loss.periods[0]': '24 HOURS',
  'nas.limits.loss.periods[1]': '7 DAYS',
  'nas.limits.loss.periods[2]': '30 DAYS',
  'nas.limits.session_duration.periods[0]': '1 HOURS',
  'nas.limits.session_duration.periods[1]': '2 HOURS',
  'nas.limits.session_duration.periods[2]': '3 HOURS',
  'nas.limits.session_duration.periods[3]': '4 HOURS',
  'nas.limits.session_duration.periods[4]': '5 HOURS',
  'nas.limits.session_duration.periods[5]': '6 HOURS',
  'nas.limits.session_duration.periods[6]': '7 HOURS',
  'nas.limits.session_duration.periods[7]': '8 HOURS',
  'nas.logstash.url': 'http://hrzn01-stage-elk.hrzn.stage:12202',
};

export default {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: config => ({
    compiler_public_path: '/',
    proxy: {
      enabled: false,
      options: {
        host: 'http://localhost:8000',
        match: /^\/api\/.*/,
      },
    },
    applicationConfig,
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: config => ({
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: null,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true,
    },
  }),

  test: config => ({
    globals: {
      ...config.globals,
      window: JSON.stringify({
        nas: applicationConfig,
      }),
    },
  }),
};
