module.exports = {
  logstash: { url: 'http://hrzn01-dev-elk.nas.local:12202' },
  nas: {
    brand: {
      password: { pattern: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
      fx_rate: { cron: '0 0 17 * * *' },
      currencies: { base: 'EUR', supported: ['EUR', 'USD', 'SEK', 'NOK', 'RUB'] },
      validation: { password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
      reasons: {
        rejection: ['reason_1', 'reason_2', 'reason_3', 'reason_4'],
        chargeback: ['reason_1', 'reason_2', 'reason_3', 'reason_4'],
      },
      locale: {
        defaultLanguage: 'en',
        languages: ['en', 'ru'],
      },
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
        countries: ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ'],
      },
    },
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
  middlewares: { unauthorized: [401], persist: { whitelist: ['auth', 'userPanels'], keyPrefix: 'nas:' } },
};
