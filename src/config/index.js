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
  app: {
    name: null,
    apiRoot: null,
    domain: null,
    version: null,
    security: false,
    currencies: [],
  },
  ...environmentConfig,
};

function getApiRoot() {
  return config.app.apiRoot
    ? config.app.apiRoot.replace(/\/$/, '')
    : '';
}

function getDomain() {
  return config.app.domain
    ? `http${config.app.security ? 's' : ''}://${config.app.domain.replace(/\/$/, '')}`
    : '';
}

export {
  getApiRoot,
  getDomain,
};

export default config;
