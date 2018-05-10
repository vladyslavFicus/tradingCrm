import _ from 'lodash';

const config = _.merge({
  availableTags: [],
  components: {
    Currency: {
      currencies: {},
    },
  },
  player: {
    files: {
      maxSize: 2,
      types: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptp
        'application/vnd.oasis.opendocument.text', // odt
        'application/vnd.oasis.opendocument.spreadsheet', // ods
        'application/msword', // doc
        'application/vnd.ms-excel', // xls
        'application/vnd.ms-powerpoint', // ppt
        'application/pdf', // pdf
        'image/tiff', // tiff
        'image/jpeg', // jpg, jpeg
        'image/png', // png
        'image/gif', // gif
        'image/bmp', // bmp
        'text/plain', // txt
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
      password: null,
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
  logstash: {
    url: '',
  },
  middlewares: {
    unauthorized: [401],
    persist: {
      whitelist: ['auth', 'userPanels', 'language', 'settings', 'dynamicFilters'],
      keyPrefix: 'nas:',
    },
    crossTabPersist: { whitelist: ['auth', 'userPanels'], keyPrefix: 'nas:' },
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

if (config.nas.validation && config.nas.brand) {
  if (config.nas.brand.password.pattern) {
    config.nas.validation.password = new RegExp(config.nas.brand.password.pattern, 'g');
  }
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

function getAvailableTags(department) {
  return config.nas.brand.tags.filter(item => item.department === department);
}

function getLimitPeriods() {
  return config.nas.limits || [];
}

function getApiRoot() {
  return '/api';
}

function getErrorApiUrl() {
  return '/log';
}

function getApiVersion() {
  return window.nas.nas.brand.api.version || config.nas.brand.api.version;
}

function getAvailableLanguages() {
  return config.nas.brand.locale.languages || [];
}

function getGraphQLRoot() {
  return config.nas.graphqlRoot;
}

function getLogo() {
  const brands = ['redbox', 'slottica', 'loki', 'vulcanprestige', 'vulcanneon'];
  let brandId = _.get(window, 'app.brandId');

  if (brandId) {
    brandId = brandId.replace(/(_\w+)/, '');
  }

  if (brands.indexOf(brandId) > -1) {
    return `/img/brand/logo/${brandId}.svg`;
  }

  return '/img/logoNewAge.png';
}

function getVersion() {
  return config.version;
}

function getDomain() {
  return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
}

function getBrandId() {
  return window.app.brandId;
}
export {
  getApiRoot,
  getBrandId,
  getErrorApiUrl,
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
