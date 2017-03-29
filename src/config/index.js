import _ from 'lodash';

const environmentConfig = {};

if (window) {
  window.nas = window.nas || {};

  const params = Object.keys(window.nas);
  if (params.length > 0) {
    params.map(i => _.set(environmentConfig, i, window.nas[i]));
  }
}

const config = {
  api: {},
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
  nas: {
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
  },
  middlewares: {},
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
        .forEach(tag => {
          config.nas.tags.priorities[priority][tag].departments.forEach(department => {
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
  return config.nas.reasons.rejection || [];
}

function getApiRoot() {
  return config.api.entry
    ? config.api.entry.replace(/\/$/, '')
    : '';
}

function getDomain() {
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}

export {
  getApiRoot,
  getDomain,
  getAvailableTags,
  getTransactionRejectReasons,
};

export default config;
