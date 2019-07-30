const fetchBrandsConfig = require('./utils/fetch-brands-config');
const platformConfig = require('./utils/platform-config');

const {
  NAS_PROJECT,
  NAS_BRAND = 'falcon',
  APP_VERSION = 'dev',
} = process.env;

module.exports = async () => {
  const brandsConfig = await fetchBrandsConfig({ zookeeperUrl: platformConfig.zookeeper.url });

  return {
    version: APP_VERSION,
    apiRoot: platformConfig.hrzn.api_url,
    graphqlRoot: '/api/forex_graphql/gql',
    brands: brandsConfig,
    environment: NAS_PROJECT,
    defaultBackofficeBrand: NAS_BRAND,
  };
};
