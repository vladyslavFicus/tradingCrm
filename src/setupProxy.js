const { createProxyMiddleware } = require('http-proxy-middleware');
const buildConfig = require('../docker/buildConfig');
const platform = require('../docker/platform');

let config = null;

module.exports = (app) => {
  app.use('/api', async (...args) => {
    const platformConfig = await platform.load();

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

  // Proxy for cloud static resources
  app.use('/cloud-static', createProxyMiddleware({
    target: process.env.CLOUD_STATIC_URL,
    pathRewrite: {
      '^/cloud-static': '',
    },
    changeOrigin: true,
  }));
};
