import _ from 'lodash';

const environmentConfig = {};

if (window && window.nas) {
  const params = Object.keys(window.nas);
  if (params.length > 0) {
    params.map(i => _.set(environmentConfig, i, window.nas[i]));
  }
}

const config = {
  availableDepartments: [],
  availableRoles: [],
  availableTags: [],
  providers: {
    stakelogic: 'Stakelogic',
    netent: 'Netent',
    igromat: 'Igromat',
  },
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
    api: {
      url: '',
    },
    brand: '',
    currencies: {
      base: null,
      supported: [],
    },
    validation: {
      password: null,
    },
    departments: [],
    tags: {},
    reasons: {
      rejection: [],
    },
    limits: {},
    locale: {
      languages: [],
      defaultLanguage: 'en',
    },
  },
  logstash: {
    url: '',
  },
  middlewares: {},
  modules: {
    bonusCampaign: {
      cancelReasons: {
        CANCEL_REASON_1: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_1',
        CANCEL_REASON_2: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_2',
        CANCEL_REASON_3: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_3',
        CANCEL_REASON_4: 'CONSTANTS.BONUS_CAMPAIGNS.CANCELLATION_REASONS.CANCEL_REASON_4',
      },
    },
  },
  ...environmentConfig,
};

if (config.nas.validation) {
  if (config.nas.validation.password) {
    config.nas.validation.password = new RegExp(config.nas.validation.password, 'g');
  }
}

if (config.nas.departments) {
  config.availableDepartments = config.nas.departments;
  config.availableDepartments.splice(config.availableDepartments.indexOf('PLAYER'), 1);
  config.availableDepartments = config.availableDepartments.map(item => ({
    value: item,
    label: item,
  }));
}

if (config.nas.roles) {
  config.availableRoles = config.nas.roles.map(item => ({
    value: item,
    label: item,
  }));
}

if (config.nas.tags) {
  config.nas.tags = Object
    .keys(config.nas.tags.priorities)
    .reduce((result, priority) => {
      Object.keys(config.nas.tags.priorities[priority])
        .forEach((tag) => {
          config.nas.tags.priorities[priority][tag].departments.forEach((department) => {
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
  return config.nas.tags.filter(item => item.department === department);
}

function getTransactionRejectReasons() {
  return config.nas.reasons && config.nas.reasons.rejection ? config.nas.reasons.rejection : [];
}

function getTransactionChargebackReasons() {
  return config.nas.reasons && config.nas.reasons.chargeback ? config.nas.reasons.chargeback : [];
}

function getLimitPeriods() {
  return config.nas.limits || [];
}

function getApiRoot() {
  return config.brand.api.url
    ? config.brand.api.url.replace(/\/$/, '')
    : '';
}

function getErrorApiUrl() {
  return config.logstash.url || '';
}

function getBrand() {
  return config.nas.brand;
}

function getAvailableLanguages() {
  return config.nas.locale.languages || [];
}

function getDomain() {
  return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
}

function getLogo() {
  return /vslots/.test(getApiRoot()) ? '/img/vslots-logo.png' : '/img/logoNewAge.png';
}

export {
  getApiRoot,
  getBrand,
  getErrorApiUrl,
  getDomain,
  getLogo,
  getAvailableTags,
  getTransactionRejectReasons,
  getTransactionChargebackReasons,
  getLimitPeriods,
  getAvailableLanguages,
};

export default config;
