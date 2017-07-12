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
const { BUILD_ENV } = process.env;
const APP_NAME = 'backoffice';
const REQUIRED_CONFIG_PARAM = 'nas.brand.api.url';
const consolePrefix = '[startup.js]: ';
const parseJson = (data, defaultValue = null) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};
const STATUS = {
  UP: 'UP',
  DOWN: 'DOWN',
};
const defaultHealth = {
  status: STATUS.DOWN,
  config: { status: STATUS.DOWN },
  api: { status: STATUS.DOWN },
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
  const environmentConfig = ymlReader.load(`/${APP_NAME}/lib/etc/application-${BUILD_ENV}.yml`);

  return fetchZookeeperConfig({ environmentConfig })
    .then(config => _.merge(
      {},
      config,
      { nas: environmentConfig.nas },
      { nas: { brand: environmentConfig.brand } },
      { logstash: environmentConfig.logstash },
    ));
}

function fetchConfigHealth(url) {
  return fetch(url)
    .then(response => response.text(), processError)
    .then(response => parseJson(response), processError);
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

if (!BUILD_ENV) {
  throw new Error('"BUILD_ENV" is required environment variable');
}

processConfig()
  .then(config => saveConfig(config).then(() => {
    const health = Object.assign({}, defaultHealth);
    const apiUrl = _.get(config, REQUIRED_CONFIG_PARAM);

    if (apiUrl) {
      health.config.status = STATUS.UP;

      return fetchConfigHealth(`${apiUrl}/health`)
        .then((response) => {
          if (response.version) {
            health.api.status = STATUS.UP;
          }

          if (health.config.status === STATUS.UP && health.api.status === STATUS.UP) {
            health.status = STATUS.UP;
          }

          return saveHealth(health);
        }, processError);
    }
  }), processError);
