const express = require('express');
const tokenMiddleware = require('@hrzn/express-token-middleware');
const buildConfig = require('./buildConfig');
const { saveConfig, writeRandomConfigSrcPath, buildNginxConfig } = require('./utils/config-file');

const INDEX_HTML_PATH = '/opt/build/index.html';

(async () => {
  const app = express();

  const config = await buildConfig();

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

  app.use('/api', versionMiddleware, tokenMiddleware({ apiUrl: 'http://kong', limit: '50mb' }));

  app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
})();
