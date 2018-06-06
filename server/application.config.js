module.exports = {
  nas: {
    brand: {
      password: { pattern: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
      validation: { password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
      locale: {
        defaultLanguage: 'en',
        languages: ['en', 'ru'],
      },
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
      currencies: { base: '', supported: [] },
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
  middlewares: {
    unauthorized: [401],
    persist: { whitelist: ['auth', 'userPanels', 'language', 'settings'], keyPrefix: 'nas:' },
  },
};
