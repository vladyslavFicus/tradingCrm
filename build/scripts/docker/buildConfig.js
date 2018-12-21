const path = require('path');
const ymlReader = require('yamljs');
const { v4 } = require('uuid');
const fetchBrandsConfig = require('./utils/fetch-brands-config');

const {
  NAS_PROJECT,
  API_ROOT,
  GRAPHQL_ROOT,
  SECRET_PATH = '/forex_backoffice/lib/etc/',
  NODE_ENV = 'development',
} = process.env;

if (!NAS_PROJECT) {
  throw new Error('Missing required environment variable "NAS_PROJECT"');
}

const APP_VERSION = NODE_ENV === 'development' ? 'dev' : v4();

module.exports = async () => {
  const platformConfig = ymlReader.load(path.resolve(SECRET_PATH, `application-${NAS_PROJECT}.yml`));
  const brandsConfig = await fetchBrandsConfig({ zookeeperUrl: platformConfig.zookeeper.url });

  const config = {
    version: APP_VERSION,
    apiRoot: API_ROOT || platformConfig.hrzn.api_url,
    graphqlRoot: GRAPHQL_ROOT || `${platformConfig.hrzn.api_url}/forex_graphql/gql`,
    brands: brandsConfig,
  };

  // Config for non-development environments
  if (NODE_ENV !== 'development') {
    config.sentry = {
      dsn: 'https://a3cff5493c3a4d0dbead367f8d01e700@sentry.io/1358381',
      options: {
        release: APP_VERSION,
        environment: NAS_PROJECT,
        ignoreErrors: ['Submit Validation Failed'],
      },
    };
  }

  return config;
};
