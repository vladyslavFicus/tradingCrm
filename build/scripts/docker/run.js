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
const APP_VERSION = fs.readFileSync(`${__dirname}/../build/VERSION`, { encoding: 'UTF-8' });
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

const INDEX_HTML_PATH = '/opt/build/index.html';

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
  const version = health && health.version ? health.version : '';

  const params = {
    logstashUrl: environmentConfig.logstash
      ? environmentConfig.logstash.url
      : '',
    version,
  };

  if (config) {
    Object.keys(params).forEach((name) => {
      config = config.replace(`{{${name}}}`, params[name]);
    });
  }

  fs.writeFileSync(NGINX_CONF_OUTPUT, config);

  return params;
}

async function processConfig() {
  const projectConfig = ymlReader.load(`/${APP_NAME}/lib/etc/application-${NAS_PROJECT}.yml`);

  const config = await fetchZookeeperConfig({ projectConfig });
  const nginxConfig = await compileNginxConfig(projectConfig);

  const brand = Object.assign({
    api: {
      url: projectConfig.hrzn.api_url,
      version: nginxConfig && nginxConfig.version ? nginxConfig.version : '',
    },
  }, projectConfig.brand);

  Object.keys(config.nas.brand).forEach((item) => {
    if (['currencies', 'password', 'tags', 'locale'].indexOf(item) > -1) {
      brand[item] = config.nas.brand[item];
    }
  });

  return {
    version: APP_VERSION,
    nas: { brand, graphqlRoot: `${projectConfig.hrzn.api_url}/graphql/gql` },
    sentry: {
      dsn: 'https://b14abe232a0745fb974390113d879259@sentry.io/233061',
      options: {
        release: APP_VERSION,
        environment: APP_VERSION === 'dev' ? 'development' : NAS_PROJECT,
      },
    },
  };
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

const readConfigSrcPath = () => {
  const indexHtml = fs.readFileSync(INDEX_HTML_PATH).toString();
  const re = new RegExp('(config.js.*?)"');
  return indexHtml.match(re)[1];
};

const writeRandomConfigSrcPath = () => {
  let result = fs.readFileSync(INDEX_HTML_PATH).toString();

  result = result.replace(readConfigSrcPath(), `config.js?${Math.random().toString(36).slice(2)}`);

  fs.writeFileSync(INDEX_HTML_PATH, result);
};

processConfig()
  .then(config => saveConfig(config).then(() => {
    const health = Object.assign({}, defaultHealth);
    const apiUrl = _.get(config, REQUIRED_CONFIG_PARAM);

    if (apiUrl) {
      health.config.status = STATUS.UP;
      health.status = STATUS.UP;

      log('health', health);

      writeRandomConfigSrcPath();

      return saveHealth(health);
    }
  }), processError);
