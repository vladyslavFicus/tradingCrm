const zookeeper = require('node-zookeeper-client');
const { getChildren, getProperty } = require('@hrzn/zookeeper');

function getZookeeperBrandPropertyPath(brand, property) {
  return `/system/${brand}/nas/brand/${property}`;
}

async function fetchBrandsConfigs({ zookeeperUrl }) {
  const zookeeperClient = zookeeper.createClient(zookeeperUrl);

  zookeeperClient.connect();

  const brands = await getChildren(zookeeperClient, '/system');

  const brandsConfig = await Promise.all(
    brands.map(async (id) => {
      const currencies = await getProperty(
        zookeeperClient,
        getZookeeperBrandPropertyPath(id, 'nas.brand.currencies')
      );

      const locales = await getProperty(
        zookeeperClient,
        getZookeeperBrandPropertyPath(id, 'nas.brand.locale')
      );

      const password = await getProperty(
        zookeeperClient,
        getZookeeperBrandPropertyPath(id, 'nas.brand.password')
      );

      return {
        id,
        currencies,
        locales,
        password,
      };
    })
  );

  zookeeperClient.close();

  return brandsConfig;
}

module.exports = fetchBrandsConfigs;
