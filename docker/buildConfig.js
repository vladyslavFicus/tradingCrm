const zookeeper = require('./zookeeper');
const platform = require('./platform');

const {
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
  const platformConfig = await platform.load();

  const brandsConfig = await zookeeper.load({ zookeeperUrl: platformConfig.zookeeper.url, onBrandsConfigUpdated });

  return {
    version: APP_VERSION,
    apiRoot: platformConfig.hrzn.api_url,
    graphqlRoot: GRAPHQL_ROOT || '/api/backoffice-graphql/gql',
    brands: brandsConfig,
    environment: platformConfig.env,
    defaultBackofficeBrand: NAS_BRAND,
  };
};
