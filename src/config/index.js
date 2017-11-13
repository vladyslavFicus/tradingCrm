import _ from 'lodash';

const config = _.merge({
  version: __APP_VERSION__,
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
    brand: {
      name: '',
      api: {
        url: '',
      },
      departments: [],
      tags: {},
      roles: [],
      payment: {
        reasons: {
          refuse: ['REASON_1', 'REASON_2', 'REASON_3', 'PLAYER_CANCEL'],
        },
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
    unauthorized: [401, 403],
    persist: { whitelist: ['auth', 'userPanels', 'language', 'settings'], keyPrefix: 'nas:' },
    crossTabPersist: { whitelist: ['auth'], keyPrefix: 'nas:' },
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

if (config.nas.brand.departments) {
  config.availableDepartments = config.nas.brand.departments;
  config.availableDepartments.splice(config.availableDepartments.indexOf('PLAYER'), 1);
  config.availableDepartments = config.availableDepartments.map(item => ({
    value: item,
    label: item,
  }));
}

if (config.nas.brand.roles) {
  config.availableRoles = config.nas.brand.roles.map(item => ({
    value: item,
    label: item,
  }));
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

function getTransactionRejectReasons() {
  return config.nas.brand.payment && config.nas.brand.payment.reasons && config.nas.brand.payment.reasons.refuse
    ? config.nas.brand.payment.reasons.refuse.reduce((res, item) => ({ ...res, [item]: item }), {}) : {};
}

function getTransactionChargebackReasons() {
  return config.nas.brand.reasons && config.nas.brand.reasons.chargeback
    ? config.nas.brand.reasons.chargeback.reduce((res, item) => ({ ...res, [item]: item }), {}) : {};
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

function getBrand() {
  return config.nas.brand.name;
}

function getAvailableLanguages() {
  return config.nas.brand.locale.languages || [];
}

function getLogo() {
  return /vslots/.test(getApiRoot()) ? '/img/vslots-logo.png' : '/img/logoNewAge.png';
}

function getVersion() {
  return config.version;
}

function getDomain() {
  return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
}

export {
  getApiRoot,
  getBrand,
  getErrorApiUrl,
  getLogo,
  getAvailableTags,
  getTransactionRejectReasons,
  getTransactionChargebackReasons,
  getLimitPeriods,
  getAvailableLanguages,
  getVersion,
  getDomain,
};

export default config;
