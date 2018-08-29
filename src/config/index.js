import _ from 'lodash';

const config = _.merge({
  availableTags: [],
  components: {
    Currency: {
      currencies: {},
    },
  },
  market: 'casino',
  player: {
    files: {
      maxSize: 5,
      types: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/msword', // doc
        'application/pdf', // pdf
        'image/tiff', // tiff
        'image/jpeg', // jpg, jpeg
        'image/png', // png
        'image/gif', // gif
      ],
    },
  },
  nas: {
    brand: {
      api: {
        version: 'latest',
        url: '',
      },
      tags: {},
      currencies: {
        base: 'EUR',
        supported: [],
      },
    },
    validation: {
      password: '*',
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
    locale: {
      languages: [],
      defaultLanguage: 'en',
    },
  },
  middlewares: {
    unauthorized: [401],
    persist: {
      whitelist: ['auth', 'userPanels', 'language', 'settings', 'dynamicFilters'],
      keyPrefix: 'nas:',
    },
    crossTabPersistFrame: { whitelist: ['auth'], keyPrefix: 'nas:' },
    crossTabPersistPage: { whitelist: ['auth', 'userPanels'], keyPrefix: 'nas:' },
  },
  modules: {
    bonusCampaign: {
      cancelReasons: {
        CANCEL_REASON_1: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_1',
        CANCEL_REASON_2: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_2',
        CANCEL_REASON_3: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_3',
        CANCEL_REASON_4: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_4',
      },
    },
    freeSpin: {
      cancelReasons: {
        CANCEL_REASON_1: 'CONSTANTS.FREE_SPINS.CANCELLATION_REASONS.CANCEL_REASON_1',
        CANCEL_REASON_2: 'CONSTANTS.FREE_SPINS.CANCELLATION_REASONS.CANCEL_REASON_2',
        CANCEL_REASON_3: 'CONSTANTS.FREE_SPINS.CANCELLATION_REASONS.CANCEL_REASON_3',
        CANCEL_REASON_4: 'CONSTANTS.FREE_SPINS.CANCELLATION_REASONS.CANCEL_REASON_4',
      },
    },
  },
}, (window.nas || {}));

if (config.nas.brand) {
  if (config.nas.brand.password && config.nas.brand.password.pattern) {
    config.nas.validation.password = new RegExp(config.nas.brand.password.pattern, 'g');
  }

  if (config.nas.brand.tags && config.nas.brand.tags.priorities) {
    config.nas.brand.tags = Object
      .keys(config.nas.brand.tags.priorities)
      .reduce((result, priority) => {
        Object.keys(config.nas.brand.tags.priorities[priority])
          .forEach((tag) => {
            config.nas.brand.tags.priorities[priority][tag].departments.forEach((department) => {
              result.push({
                label: tag,
                value: tag,
                priority,
                department,
              });
            });
          });

        return result;
      }, []);
  }
}

function getAvailableTags(department) {
  return config.nas.brand.tags.filter(item => item.department === department);
}

function getLimitPeriods() {
  return config.nas.limits || [];
}

function getApiRoot() {
  return '/api';
}

function getApiVersion() {
  return _.get(window, 'nas.brand.api.version', _.get(config, 'nas.brand.api.version'));
}

function getAvailableLanguages() {
  return _.get(config, 'nas.brand.locale.languages', []);
}

function getGraphQLRoot() {
  return config.nas.graphqlRoot;
}

function getBrandId() {
  return _.get(window, 'app.brandId');
}

function setBrandId(brandId) {
  window.app.brandId = brandId;
}

function getLogo() {
  const brands = [
    'hrzn_dev2',
    'redbox',
    'slottica',
    'loki',
    'vulcanprestige',
    'vulcanprestige_prod',
    'vulcanneon',
    'vulcangold',
    'gslots',
    'cerberus',
    'casino_999_dk',
    'nasfx',
  ];
  const brandId = getBrandId();

  if (brands.indexOf(brandId) > -1) {
    return `/img/brand/logo/${brandId}.svg`;
  }

  return '/img/logo-placeholder.svg';
}

function getVersion() {
  return config.version;
}

function getDomain() {
  if (window && window.location) {
    const { protocol, hostname, port } = window.location;

    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  return '';
}

export {
  getApiRoot,
  getBrandId,
  setBrandId,
  getLogo,
  getAvailableTags,
  getLimitPeriods,
  getAvailableLanguages,
  getVersion,
  getApiVersion,
  getDomain,
  getGraphQLRoot,
};

export default config;
