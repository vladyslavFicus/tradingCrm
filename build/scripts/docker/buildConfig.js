const path = require('path');
const ymlReader = require('yamljs');
const fetchBrandsConfig = require('./utils/fetch-brands-config');
const { version } = require('./utils/version');

const {
  NAS_PROJECT,
  SECRET_PATH = '/forex_backoffice/lib/etc/',
} = process.env;

if (!NAS_PROJECT) {
  throw new Error('Missing required environment variable "NAS_PROJECT"');
}

module.exports = async () => {
  const platformConfig = ymlReader.load(path.resolve(SECRET_PATH, `application-${NAS_PROJECT}.yml`));
  const brandsConfig = await fetchBrandsConfig({ zookeeperUrl: platformConfig.zookeeper.url });


  return {
    version,
    apiRoot: platformConfig.hrzn.api_url,
    graphqlRoot: '/api/forex_graphql/gql',
    brands: brandsConfig,
    environment: NAS_PROJECT,
  };
};
