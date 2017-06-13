module.exports = {
  logstash: { url: 'http://hrzn01-dev-elk.nas.local:12202' },
  brand: {
    name: 'hrzn_dev2',
    site: { url: 'http://site.casino2.app' },
    backoffice: { url: 'http://backoffice.casino2.app' },
    api: { url: 'http://api.casino2.app' },
  },
  nas: {
    brand: { password: { pattern: '^((?=.*\\\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' } },
    casino: { url: 'http://site.casino2.app' },
    backoffice: { url: 'http://backoffice.casino2.app' },
    api: { url: 'http://api.casino2.app' },
    logstash: { url: 'http://hrzn01-dev-elk.nas.local:12202' },
    'brand-name': 'NAS Casino',
    reasons: {
      rejection: ['reason_1', 'reason_2', 'reason_3', 'reason_4'],
      chargeback: ['reason_1', 'reason_2', 'reason_3', 'reason_4'],
    },
    locale: {
      defaultLanguage: 'en',
      languages: [{ value: 'en', label: 'ENG' }, { value: 'ru', label: 'RUS' }],
    },
    limits: {
      deposit: { cooloff: '7 DAYS', periods: ['24 HOURS', '7 DAYS', '30 DAYS'] },
      wager: { cooloff: '7 DAYS', periods: ['24 HOURS', '7 DAYS', '30 DAYS'] },
      loss: { cooloff: '7 DAYS', periods: ['24 HOURS', '7 DAYS', '30 DAYS'] },
      session_duration: {
        cooloff: '8 HOURS',
        periods: ['1 HOURS', '2 HOURS', '3 HOURS', '4 HOURS', '5 HOURS', '6 HOURS', '7 HOURS', '8 HOURS'],
      },
    },
    email: {
      sendgrid: {
        api_key: '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',
        from: 'support@newagesol.com',
      },
    },
    ip: { db: { path: 'classpath:GeoLite2-Country.mmdb' } },
    fx_rate: { cron: '0 0 17 * * *' },
    currencies: { base: 'EUR', supported: ['EUR', 'USD', 'SEK', 'NOK', 'RUB'] },
    validation: { password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
    departments: ['PLAYER', 'CS', 'RFP', 'MARKETING'],
    roles: ['ROLE4', 'ROLE3', 'ROLE2', 'ROLE1'],
    tags: {
      priorities: {
        neutral: {
          tag1: { departments: ['CS', 'RFP', 'MARKETING'] },
          tag2: { departments: ['CS'] },
          tag4: { departments: ['CS'] },
        },
        positive: {
          tag1: { departments: ['CS'] },
          tag2: { departments: ['RFP'] },
          tag3: { departments: ['CS', 'MARKETING'] },
        },
        negative: {
          tag1: { departments: ['CS'] },
          tag2: { departments: ['CS', 'RFP'] },
          tag3: { departments: ['RFP', 'MARKETING'] },
          tag4: { departments: ['CS', 'RFP', 'MARKETING'] },
        },
      },
    },
    country: {
      general: '--',
      countries: ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT'],
    },
  },
  components: {
    Currency: {
      currencies: {
        EUR: { symbol: 'â‚¬', symbolOnLeft: true },
        USD: { symbol: '$', symbolOnLeft: true },
        RUB: { symbol: 'â‚½', symbolOnLeft: true },
        UAH: { symbol: 'â‚´', symbolOnLeft: true },
        GBP: { symbol: 'Â£', symbolOnLeft: true },
        SEK: { symbol: 'kr', symbolOnLeft: false },
        NOK: { symbol: 'kr', symbolOnLeft: false },
      },
    },
  },
  middlewares: { unauthorized: [401], persist: { whitelist: ['auth', 'userPanels'], keyPrefix: 'nas:' } },
};

