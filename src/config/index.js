const environmentConfiguration = __CONFIG_ENV__ || {};

const config = {
  name: 'NAS Casino',
  version: '0.0.1a',
  availableLocales: [
    'en',
    'ru',
  ],
  API_ROOT: '',
  DOMAIN: '',
  GRAYLOG: {},
  ...environmentConfiguration,
};

if (!!window && !!window.NAS && typeof window.NAS === 'object') {
  if (!!window.NAS.NAS_API_ROOT) {
    config.API_ROOT = window.NAS.NAS_API_ROOT;
  }

  if (!!window.NAS.NAS_DOMAIN) {
    config.DOMAIN = window.NAS.NAS_DOMAIN;
  }

  if (window.NAS.GRAYLOG) {
    config.GRAYLOG = window.NAS.GRAYLOG;
  }
}

export function getApiRoot() {
  return config.API_ROOT.replace(/\/$/, '');
}

export function getDomain() {
  return config.DOMAIN.replace(/\/$/, '');
}

export default config;
