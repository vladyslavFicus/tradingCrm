const zookeeper = require('./zookeeper');
const infra = require('./infra');

const {
  NAS_BRAND = 'falcon',
  APP_VERSION = 'dev',
  GRAPHQL_ROOT,
  NODE_ENV,
} = process.env;

const __DEV__ = NODE_ENV === 'development';

/**
 * Build application config
 *
 * @param onBrandsConfigUpdated Callback when brands config was updated remotely (on zookeeper)
 *
 * @return Promise
 */
module.exports = async (onBrandsConfigUpdated) => {
  const infraConfig = await infra.load();

  const brandsConfig = await zookeeper.load({
    zookeeperUrl: infraConfig.zookeeper[__DEV__ ? 'ext_url' : 'url'], // Usage 'ext_url' for local and 'url' in k8s
    onBrandsConfigUpdated,
  });

  return {
    version: APP_VERSION,
    apiRoot: infraConfig.hrzn.api_url,
    graphqlRoot: GRAPHQL_ROOT || '/api/backoffice-graphql/gql',
    brands: brandsConfig,
    environment: infraConfig.env,
    defaultBackofficeBrand: NAS_BRAND,
  };
};
