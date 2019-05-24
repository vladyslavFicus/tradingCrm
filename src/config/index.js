import _ from 'lodash';

const config = _.merge({
  components: {
    Currency: {
      currencies: {},
    },
  },
  market: 'crm',
  player: {
    files: {
      maxSize: 20,
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

function getApiRoot() {
  return '/api';
}

function getApiVersion() {
  return config.version;
}

function getAvailableLanguages() {
  return _.get(window, 'app.brand.locales.languages', []);
}

function getGraphQLRoot() {
  return config.graphqlRoot;
}

function getActiveBrandConfig() {
  return _.get(window, 'app.brand');
}

function getBrandId() {
  return _.get(window, 'app.brandId');
}

function getPaymentReason() {
  return _.get(window, 'app.brand.payment.reasons');
}

function getClickToCall() {
  return _.get(window, 'app.brand.clickToCall');
}

function setBrandId(brandId) {
  window.app.brandId = brandId;
  window.app.brand = brandId ? config.brands.find(brand => brand.id === brandId) : null;
}

function getLogo() {
  return `/img/brand/header/${getBrandId()}.svg`;
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
  getActiveBrandConfig,
  getAvailableLanguages,
  getVersion,
  getApiVersion,
  getDomain,
  getGraphQLRoot,
  getPaymentReason,
  getClickToCall,
};

export default config;
