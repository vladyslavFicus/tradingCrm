const express = require('express');
const tokenMiddleware = require('@hrzn/express-token-middleware');
const buildConfig = require('./buildConfig');
const { saveConfig, writeRandomConfigSrcPath, createHealth, buildNginxConfig } = require('./utils/config-file');

const INDEX_HTML_PATH = '/opt/build/index.html';

(async () => {
  const app = express();

  const config = await buildConfig();

  await buildNginxConfig();
  await saveConfig(config);
  await writeRandomConfigSrcPath(INDEX_HTML_PATH);
  await createHealth();

  app.use('/api', tokenMiddleware({ apiUrl: 'http://kong', limit: '50mb' }));

  app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
})();
