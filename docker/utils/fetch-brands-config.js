const getBrandsConfig = require('@hrzn/brands-config');
const mapZookeeperBrandsConfig = require('./mapZookeeperBrandsConfig');

async function fetchBrandsConfig({ zookeeperUrl, onBrandsConfigUpdated }) {
  const timerId = setInterval(() => {
    console.log('\x1b[31m', '❌ Zookeeper configuration can not be loaded in 10 sec... Check your VPN!', '\x1b[31m');
  }, 10000);

  console.log('\x1b[32m', '⏳ Zookeeper configuration loading...', '\x1b[37m');

  const options = {
    watchFunction: config => onBrandsConfigUpdated(mapZookeeperBrandsConfig(config)),
  };

  const brandsConfig = await getBrandsConfig(
    zookeeperUrl,
    [
      'nas.brand.currencies',
      'nas.brand.locale',
      'nas.brand.password',
      'nas.brand.payment',
      'nas.brand.clickToCall',
      'nas.brand.regulation',
      'nas.brand.mt4.groups',
      'nas.brand.mt4.demo_groups',
      'nas.brand.mt5.groups',
      'nas.brand.mt5.demo_groups',
      'nas.brand.email.sendgrid.crm_templated_emails',
      'nas.brand.backoffice.riskCalculator',
      'nas.brand.backoffice.socialTrading',
      'nas.brand.backoffice.fsaRegulation',
      'nas.brand.backoffice.privatePhoneByDepartment',
      'nas.brand.backoffice.privateEmailByDepartment',
    ],
    null,
    options,
  );

  clearInterval(timerId);

  console.log('\x1b[32m', '✅ Zookeeper configuration loaded successfully', '\x1b[37m');

  return mapZookeeperBrandsConfig(brandsConfig);
}

module.exports = fetchBrandsConfig;
