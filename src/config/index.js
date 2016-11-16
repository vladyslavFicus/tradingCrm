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
  ...environmentConfiguration,
};

if (!!window && !!window.NAS && typeof window.NAS === 'object' && !!window.NAS.NAS_API_ROOT) {
  config.API_ROOT = window.NAS.NAS_API_ROOT;
}

export function getApiRoot() {
  return config.API_ROOT.replace(/\/$/, '');
}

export default config;
