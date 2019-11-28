const http = require('http');
const { exec } = require('child_process');
const buildConfig = require('./buildConfig');
const { saveConfig, writeRandomConfigSrcPath, buildNginxConfig } = require('./utils/config-file');

const INDEX_HTML_PATH = '/opt/build/index.html';

let config = null;

(async () => {
  // Callback when brand configs changed remotely. We need to write new config to config.js file
  const onBrandsConfigUpdated = async (brands) => {
    config.brands = brands;

    await saveConfig(config);
    await writeRandomConfigSrcPath(INDEX_HTML_PATH);
  };

  config = await buildConfig(onBrandsConfigUpdated);

  await buildNginxConfig();
  await saveConfig(config);
  await writeRandomConfigSrcPath(INDEX_HTML_PATH);

  exec('nginx -s reload');

  // We need http server to proxy requests from nginx to know that background process still a live
  // In this background process we listen zookeeper watcher events to auto-update brands configuration
  http.createServer((_, res) => res.end(JSON.stringify({ status: 'UP' }))).listen(3000);
})();
