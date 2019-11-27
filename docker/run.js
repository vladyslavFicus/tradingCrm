const express = require('express');
const buildConfig = require('./buildConfig');
const { saveConfig, writeRandomConfigSrcPath, buildNginxConfig } = require('./utils/config-file');

const INDEX_HTML_PATH = '/opt/build/index.html';

let config = null;

(async () => {
  const app = express();

  // Callback when brand configs changed remotely. We need to write new config to config.js file
  const onBrandsConfigUpdated = async (brands) => {
    config.brands = brands;

    await saveConfig(config);
    await writeRandomConfigSrcPath(INDEX_HTML_PATH);
  };

  config = await buildConfig(onBrandsConfigUpdated);

  const versionMiddleware = (req, res, next) => {
    const clientVersion = req.get('x-client-version');

    if (clientVersion && clientVersion !== config.version) {
      return res.status(426).send();
    }

    return next();
  };

  await buildNginxConfig();
  await saveConfig(config);
  await writeRandomConfigSrcPath(INDEX_HTML_PATH);

  app.use('/api', versionMiddleware);

  app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
})();
