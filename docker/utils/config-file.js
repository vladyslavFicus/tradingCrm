const fs = require('fs');

const { APP_VERSION } = process.env;

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

function writeRandomConfigSrcPath(htmlPath) {
  let result = fs.readFileSync(htmlPath).toString();

  result = result.replace('config.js', `config.js?${Math.random().toString(36).slice(2)}`);

  fs.writeFileSync(htmlPath, result);
}

function buildNginxConfig() {
  let config = fs.readFileSync(process.env.NGINX_CONF_OUTPUT, { encoding: 'UTF8' });

  if (config) {
    config = config.replace('{{version}}', APP_VERSION);
  }

  fs.writeFileSync(process.env.NGINX_CONF_OUTPUT, config);
}

module.exports = {
  buildNginxConfig,
  saveConfig,
  writeRandomConfigSrcPath,
};