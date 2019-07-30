const tokenMiddleware = require('@hrzn/express-token-middleware');
const platformConfig = require('../docker/utils/platform-config');
const buildConfig = require('../docker/buildConfig');

let config = null;

module.exports = (app) => {
  app.use('/api', tokenMiddleware({
    apiUrl: platformConfig.hrzn.api_url,
    rewriteProxy: [{ regexp: /\/gql/, url: process.env.GRAPHQL_ROOT }],
    limit: '50mb',
  }));

  app.get('/config.js', async (req, res) => {
    if (!config) {
      // Callback when brand configs changed remotely. We need to write new brands config to global config variable
      const onBrandsConfigUpdated = (brands) => {
        config.brands = brands;
      };

      config = await buildConfig(onBrandsConfigUpdated);
    }

    res.contentType('application/javascript');
    res.send(`window.nas = ${JSON.stringify(config)}`);
  });
};
