module.exports = {
  version: Date.now(),
  logstash: { url: 'http://hrzn01-dev-elk.nas.local:12202' },
  nas: {
    brand: {
      name: 'hrzn_dev2',
      password: { pattern: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
      fx_rate: { cron: '0 0 17 * * *' },
      validation: { password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
      reasons: {
        chargeback: ['reason_1', 'reason_2', 'reason_3', 'reason_4'],
      },
      payment: {
        reasons: {
          refuse: ['REASON_1', 'REASON_2', 'REASON_3', 'PLAYER_CANCEL'],
        },
      },
      locale: {
        defaultLanguage: 'en',
        languages: ['en', 'ru'],
      },
      departments: ['PLAYER', 'CS', 'RFP', 'MARKETING', 'ADMINISTRATION'],
      roles: ['ROLE4', 'ROLE3', 'ROLE2', 'ROLE1'],
      tags: {
        priorities: {
          neutral: {
            tag1: { departments: ['CS', 'RFP', 'MARKETING', 'ADMINISTRATION'] },
            tag2: { departments: ['CS', 'ADMINISTRATION'] },
            tag4: { departments: ['CS', 'ADMINISTRATION'] },
          },
          positive: {
            tag1: { departments: ['CS', 'ADMINISTRATION'] },
            tag2: { departments: ['RFP', 'ADMINISTRATION'] },
            tag3: { departments: ['CS', 'MARKETING', 'ADMINISTRATION'] },
          },
          negative: {
            tag1: { departments: ['CS', 'ADMINISTRATION'] },
            tag2: { departments: ['CS', 'RFP', 'ADMINISTRATION'] },
            tag3: { departments: ['RFP', 'MARKETING', 'ADMINISTRATION'] },
            tag4: { departments: ['CS', 'RFP', 'MARKETING', 'ADMINISTRATION'] },
          },
        },
      },
      country: {
        general: '--',
        countries: ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ'],
      },
      claim_bonus: { enable: true },
    },
    currencies: { base: 'EUR', supported: ['EUR', 'USD', 'SEK', 'NOK', 'RUB'] },
  },
  components: {
    Currency: {
      currencies: {
        EUR: { symbol: '€', symbolOnLeft: true },
        USD: { symbol: '$', symbolOnLeft: true },
        RUB: { symbol: '₽', symbolOnLeft: true },
        UAH: { symbol: '₴', symbolOnLeft: true },
        GBP: { symbol: '£', symbolOnLeft: true },
        SEK: { symbol: 'kr', symbolOnLeft: false },
        NOK: { symbol: 'kr', symbolOnLeft: false },
      },
    },
  },
  middlewares: {
    unauthorized: [401],
    persist: { whitelist: ['auth', 'userPanels', 'language', 'settings'], keyPrefix: 'nas:' },
  },
};
