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
  nas: {
    currencies: {
      base: null,
      supported: [],
    },
    validation: {
      password: null,
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
};

export default config;
