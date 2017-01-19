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
  validation: {
    password: null,
  },
  middlewares: {},
  ...environmentConfig,
};

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
