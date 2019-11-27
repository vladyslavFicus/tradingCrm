const fetchBrandsConfig = require('./utils/fetch-brands-config');
const platformConfig = require('./utils/platform-config');

const {
  NAS_PROJECT,
  NAS_BRAND = 'falcon',
  APP_VERSION = 'dev',
  GRAPHQL_ROOT,
} = process.env;

/**
 * Build application config
 *
 * @param onBrandsConfigUpdated Callback when brands config was updated remotely (on zookeeper)
 *
 * @return Promise
 */
module.exports = async (onBrandsConfigUpdated) => {
  const brandsConfig = await fetchBrandsConfig({ zookeeperUrl: platformConfig.zookeeper.url, onBrandsConfigUpdated });

  return {
    version: APP_VERSION,
    apiRoot: platformConfig.hrzn.api_url,
    graphqlRoot: GRAPHQL_ROOT || '/api/backoffice-graphql/gql',
    brands: brandsConfig,
    environment: NAS_PROJECT,
    defaultBackofficeBrand: NAS_BRAND,
  };
};
