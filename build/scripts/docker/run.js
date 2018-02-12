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
const { NAS_PROJECT, NGINX_CONF_OUTPUT } = process.env;
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
const saveHealth = (health) => {
  fs.writeFileSync('/opt/health.json', JSON.stringify(health), { encoding: 'utf8' });
};

function processError(error) {
  log(error);

  saveHealth(defaultHealth).then(() => {
    process.exit(1);
  });
}

function fetchHealth(apiUrl) {
  return fetch(`${apiUrl}/health`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

async function compileNginxConfig(environmentConfig) {
  let config = fs.readFileSync('/opt/docker/nginx.conf.tpl', { encoding: 'UTF-8' });
  const health = await fetchHealth(environmentConfig.hrzn.api_url);

  const params = {
    logstashUrl: environmentConfig.logstash
      ? environmentConfig.logstash.url
      : '',
    version: health && health.version ? health.version : '',
  };

  if (config) {
    Object.keys(params).forEach((name) => {
      config = config.replace(`{{${name}}}`, params[name]);
    });
  }

  fs.writeFileSync(NGINX_CONF_OUTPUT, config);
}

function processConfig() {
  const projectConfig = ymlReader.load(`/${APP_NAME}/lib/etc/application-${NAS_PROJECT}.yml`);

  return fetchZookeeperConfig({ projectConfig })
    .then((config) => {
      compileNginxConfig(projectConfig);

      const brand = Object.assign({
        api: { url: projectConfig.hrzn.api_url },
      }, projectConfig.brand);

      Object.keys(config.nas.brand).forEach((item) => {
        if (['currencies', 'departments', 'roles', 'password', 'tags', 'locale'].indexOf(item) > -1) {
          brand[item] = config.nas.brand[item];
        }
      });

      return { nas: { brand } };
    });
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

if (!NAS_PROJECT) {
  throw new Error('"NAS_PROJECT" is required environment variable');
}

processConfig()
  .then(config => saveConfig(config).then(() => {
    const health = Object.assign({}, defaultHealth);
    const apiUrl = _.get(config, REQUIRED_CONFIG_PARAM);

    if (apiUrl) {
      health.config.status = STATUS.UP;
      health.status = STATUS.UP;

      log('health', health);

      return saveHealth(health);
    }
  }), processError);
