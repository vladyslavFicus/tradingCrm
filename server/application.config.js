module.exports = {
  kafka: {
    address: 'hrzn01-dev-kafka01.nas.local:9092,hrzn01-dev-kafka02.nas.local:9092,hrzn01-dev-kafka03.nas.local:9092',
    schema: { registry: { url: 'http://hrzn01-dev-kafka01.nas.local:8081' } },
  },
  mariadb: { url: 'mysql://hrzn01-dev-mariadb01.nas.local:3306' },
  pgsql: { url: 'postgresql://hrzn01-dev-pgsql01.nas.local:5432' },
  elasticsearch: {
    url: 'elasticsearch://hrzn01-dev-es01.nas.local:9300',
    cluster: 'hrzn01-dev-es-cluster',
    index: { player: 'hrzn_dev2_player' },
  },
  logstash: { url: 'http://hrzn01-dev-elk.nas.local:12202' },
  zookeeper: { url: 'hrzn01-dev-kafka01.nas.local:2181,hrzn01-dev-kafka02.nas.local:2181,hrzn01-dev-kafka03.nas.local:2181' },
  brand: {
    name: 'hrzn_dev2',
    swarm_port: 82,
    site: { url: 'http://site.casino2.app' },
    backoffice: { url: 'http://backoffice.casino2.app' },
    api: { url: 'http://api.casino2.app' },
  },
  management: { security: { enabled: false } },
  endpoints: {
    autoconfig: { enabled: false },
    beans: { enabled: false },
    configprops: { enabled: false },
    dump: { enabled: false },
    env: { enabled: false },
    flyway: { enabled: false },
    health: { sensitive: false },
    info: { enabled: false },
    mappings: { enabled: false },
    shutdown: { enabled: false },
    trace: { enabled: false },
  },
  auth: { server: { 'token-validate': { path: 'http://auth:9090/access/validate' } } },
  spring: { datasource: { hikari: { password: 'AhH1gohzahYeegh3VohT' } } },
  nas: {
    fx_rate: { cron: '0 0 17 * * *' },
    currencies: { base: 'EUR', supported: ['EUR', 'USD', 'SEK', 'NOK', 'RUB'] },
    validation: { password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' },
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
    brand: { password: { pattern: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%_]).{6,32})$' } },
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
