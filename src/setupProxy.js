const { createProxyMiddleware } = require('http-proxy-middleware');
const buildConfig = require('../docker/buildConfig');
const infra = require('../docker/infra');

let config = null;

module.exports = (app) => {
  app.use('/api', async (...args) => {
    const platformConfig = await infra.load();

    return createProxyMiddleware({
      target: platformConfig.hrzn.api_url,
      pathRewrite: {
        '^/api': '',
      },
      changeOrigin: true,
    })(...args);
  });

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
