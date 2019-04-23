const path = require('path');
const ymlReader = require('yamljs');
const fetchBrandsConfig = require('./utils/fetch-brands-config');
const { version } = require('./utils/version');

const {
  NAS_PROJECT,
  // GRAPHQL_ROOT,
  SECRET_PATH = '/forex_backoffice/lib/etc/',
  NODE_ENV = 'development',
} = process.env;

if (!NAS_PROJECT) {
  throw new Error('Missing required environment variable "NAS_PROJECT"');
}

module.exports = async () => {
  const platformConfig = ymlReader.load(path.resolve(SECRET_PATH, `application-${NAS_PROJECT}.yml`));
  const brandsConfig = await fetchBrandsConfig({ zookeeperUrl: platformConfig.zookeeper.url });

  const config = {
    version,
    apiRoot: platformConfig.hrzn.api_url,
    graphqlRoot: '/api/forex_graphql/gql',
    brands: brandsConfig,
  };

  // Config for non-development environments
  if (NODE_ENV !== 'development') {
    config.sentry = {
      dsn: 'https://a3cff5493c3a4d0dbead367f8d01e700@sentry.io/1358381',
      options: {
        release: version,
        environment: NAS_PROJECT,
        tags: { platformVersion: version },
        ignoreErrors: ['Submit Validation Failed'],
      },
    };
  }

  return config;
};
