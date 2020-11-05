const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  // Proxy-passing /api/attachment requests to /attachment endpoint
  app.use('/api/attachment', createProxyMiddleware({
    target: process.env.API_URL.replace('/gql', ''), // Replace `/gql` to avoiding adding new ENV variable
    pathRewrite: {
      '^/api': '',
    },
    changeOrigin: true,
  }));

  // Proxy-passing /api requests to /gql endpoint
  app.use('/api', createProxyMiddleware({
    target: process.env.API_URL,
    pathRewrite: {
      '^/api': '',
    },
    changeOrigin: true,
  }));

  // Proxy for cloud static resources
  app.use('/cloud-static', createProxyMiddleware({
    target: process.env.CLOUD_STATIC_URL,
    pathRewrite: {
      '^/cloud-static': '',
    },
    changeOrigin: true,
  }));
};
