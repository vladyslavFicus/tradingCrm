const proxy = require('http-proxy-middleware');
const platformConfig = require('../docker/utils/platform-config');
const buildConfig = require('../docker/buildConfig');

let config = null;

module.exports = (app) => {
  app.use(proxy('/api', {
    target: platformConfig.hrzn.api_url,
    pathRewrite: {
      '^/api': '',
    },
    changeOrigin: true,
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
