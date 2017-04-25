const process = require('process');
const fs = require('fs');
const fetch = require('isomorphic-fetch');

const consolePrefix = '[startup.js]: ';
const log = data => console.log(consolePrefix, data);
const delay = time => new Promise(resolve => setTimeout(resolve, time));
const STATUS = {
  UP: 'UP',
  DOWN: 'DOWN',
};
function fetchConfigByURL(url, timeout = 5, attempts = 10) {
  const loadConfig = (url, sleep = 0, retry = 0) => fetch(url)
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
          .then(() => loadConfig(url, sleep, retry));
      }

      return response.json();
    });

  return new Promise((resolve, reject) => {
    loadConfig(url)
      .then(json => resolve(json), error => reject(error));
  });
}

function processSpringConfig(springConfig) {
  const config = springConfig.propertySources.reduce((res, item) => Object.assign(res, item.source), {});

  fs.writeFile('/opt/build/config.js', `window.nas=${JSON.stringify(config)};`, (error) => {
    if (error) {
      processError(error);
    }

    if (config['api.entry']) {
      const status = STATUS.UP;
      fs.writeFileSync('/opt/health.json', JSON.stringify({ status, config: { status } }));
    }
  });
}

function processError(error) {
  log(error);
  fs.writeFileSync('/opt/health.json', JSON.stringify({ status: STATUS.DOWN, config: { status: STATUS.DOWN } }));
  process.exit(1);
}

const { CONFIG_SERVICE_ROOT, BUILD_ENV } = process.env;

if (!CONFIG_SERVICE_ROOT) {
  throw new Error('"CONFIG_SERVICE_ROOT" is required environment variable');
}

if (!BUILD_ENV) {
  throw new Error('"BUILD_ENV" is required environment variable');
}

fetchConfigByURL(`${CONFIG_SERVICE_ROOT}/backoffice/${BUILD_ENV}`)
  .then(processSpringConfig, processError);
