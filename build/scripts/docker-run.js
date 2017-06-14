const process = require('process');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const _ = require('lodash');
const fetchZookeeperConfig = require('./fetch-zookeeper-config');

/**
 * ==================
 *  Vars
 * ==================
 */
const { CONFIG_SERVICE_ROOT, BUILD_ENV } = process.env;
const REQUIRED_CONFIG_PARAM = 'brand.api.url';
const CONFIG_VARIABLE_LINK_REGEX = /\${(([\w]+.)+)}/;
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
const delay = time => new Promise(resolve => setTimeout(resolve, time));
const getValueByLink = (o, link, defaultValue = null) => {
  const match = link.match(CONFIG_VARIABLE_LINK_REGEX);

  if (match && match[1] && typeof o[match[1]] !== 'undefined') {
    return o[match[1]];
  }

  return defaultValue;
};
const assignValues = (o) => {
  const linkRegex = new RegExp(CONFIG_VARIABLE_LINK_REGEX, 'g');

  return Object
    .keys(o)
    .reduce((res, key) => {
      if (typeof o[key].match === 'function') {
        const matches = o[key].match(linkRegex);

        if (matches) {
          const matchedResult = Object.assign({}, res);
          matches.forEach((link) => {
            const value = getValueByLink(matchedResult, link);

            if (value !== null) {
              matchedResult[key] = matchedResult[key].replace(link, getValueByLink(matchedResult, link));
            }
          });

          return matchedResult;
        }
      }

      return res;
    }, o);
};
const saveHealth = health => new Promise((resolve) => {
  fs.writeFile('/opt/health.json', JSON.stringify(health), () => {
    resolve();
  });
});

function processError(error) {
  log(error);

  saveHealth(defaultHealth).then(() => {
    process.exit(1);
  });
}

function processSpringConfig(pureSpringConfig) {
  const springConfig = assignValues(
    pureSpringConfig.propertySources.reduce((res, item) => _.merge({}, res, item.source), {})
  );
  const formattedSpringConfig = {};
  Object.keys(springConfig).map(i => _.set(formattedSpringConfig, i, springConfig[i]));

  return fetchZookeeperConfig({
    path: `/website/lib/etc/application-${NAS_ENV}.yml`,
    allowedKeys: ['nas.brand.password.pattern'],
  }).then(function (config) {
    return _.merge({}, formattedSpringConfig, config);
  });
}

function fetchConfigByURL(url, timeout = 5, attempts = 10) {
  const loadConfig = (configUrl, sleep = 0, retry = 0) => fetch(configUrl)
    .then((response) => {
      retry++;
      log(`Retry: ${retry}, sleep: ${sleep}`);
      log(`Status: ${response.status}`);

      if (response.status !== 200) {
        if (retry === attempts) {
          throw new Error('Config service is too long unavailable');
        }

        sleep += timeout;
        return delay(sleep * 1000)
          .then(() => loadConfig(configUrl, sleep, retry));
      }

      return response.text();
    });

  return new Promise((resolve, reject) => {
    loadConfig(url)
      .then(data => resolve(parseJson(data)), error => reject(error));
  });
}

function fetchConfigHealth(url) {
  return fetch(url)
    .then(response => response.text(), processError)
    .then(response => parseJson(response), processError);
}

function saveConfig(config) {
  return new Promise((resolve, reject) => {
    fs.writeFile('/opt/build/config.js', `window.nas = ${JSON.stringify(config)};`, (error) => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
}

if (!CONFIG_SERVICE_ROOT) {
  throw new Error('"CONFIG_SERVICE_ROOT" is required environment variable');
}

if (!BUILD_ENV) {
  throw new Error('"BUILD_ENV" is required environment variable');
}

fetchConfigByURL(`${CONFIG_SERVICE_ROOT}/backoffice/${NAS_ENV}`)
  .then(processSpringConfig, processError)
  .then(config => saveConfig(config).then(() => {
    const health = Object.assign({}, defaultHealth);

    if (config[REQUIRED_CONFIG_PARAM]) {
      health.config.status = STATUS.UP;

      return fetchConfigHealth(`${config[REQUIRED_CONFIG_PARAM]}/config/health`)
        .then((response) => {
          if (response.status === STATUS.UP) {
            health.api.status = STATUS.UP;
          }

          if (health.config.status === STATUS.UP && health.api.status === STATUS.UP) {
            health.status = STATUS.UP;
          }

          return saveHealth(health);
        }, processError);
    }
  }), processError);
