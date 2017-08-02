const process = require('process');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const ymlReader = require('yamljs');
const _ = require('lodash');
const fetchZookeeperConfig = require('./fetch-zookeeper-config');

/**
 * ==================
 *  Vars
 * ==================
 */
const { NAS_ENV } = process.env;
const APP_NAME = 'backoffice';
const REQUIRED_CONFIG_PARAM = 'nas.brand.api.url';
const consolePrefix = '[startup.js]: ';
const STATUS = {
  UP: 'UP',
  DOWN: 'DOWN',
};
const defaultHealth = {
  status: STATUS.DOWN,
  config: { status: STATUS.DOWN },
};

/**
 * ==================
 *  Utils
 * ==================
 */
const log = data => console.log(consolePrefix, data);
const saveHealth = health => new Promise((resolve) => {
  fs.writeFile('/opt/health.json', JSON.stringify(health), { encoding: 'utf8' }, () => {
    resolve();
  });
});

function processError(error) {
  log(error);

  saveHealth(defaultHealth).then(() => {
    process.exit(1);
  });
}

function processConfig() {
  const environmentConfig = ymlReader.load(`/${APP_NAME}/lib/etc/application-${NAS_ENV}.yml`);

  return fetchZookeeperConfig({ environmentConfig })
    .then(config => _.merge(
      {},
      config,
      { nas: environmentConfig.nas },
      { nas: { brand: environmentConfig.brand } },
      { logstash: environmentConfig.logstash },
    ));
}

function saveConfig(config) {
  return new Promise((resolve, reject) => {
    fs.writeFile('/opt/build/config.js', `window.nas = ${JSON.stringify(config)};`, { encoding: 'utf8' }, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

if (!NAS_ENV) {
  throw new Error('"NAS_ENV" is required environment variable');
}

processConfig()
  .then(config => saveConfig(config).then(() => {
    const health = Object.assign({}, defaultHealth);
    const apiUrl = _.get(config, REQUIRED_CONFIG_PARAM);

    if (apiUrl) {
      health.config.status = STATUS.UP;
      health.status = STATUS.UP;

      return saveHealth(health);
    }
  }), processError);
