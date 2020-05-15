const fs = require('fs');

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

module.exports = {
  saveConfig,
  writeRandomConfigSrcPath,
};
