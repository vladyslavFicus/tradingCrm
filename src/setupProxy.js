const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  // Proxy-passing /api/attachment requests to /attachment endpoint
  app.use(createProxyMiddleware('/api/attachment', {
    target: process.env.API_URL.replace('/gql', ''), // Replace `/gql` to avoiding adding new ENV variable
    pathRewrite: {
      '^/api': '',
    },
    changeOrigin: true,
  }));

  // Proxy-passing /api requests to /gql endpoint
  app.use(createProxyMiddleware('/api', {
    target: process.env.API_URL,
    pathRewrite: {
      '^/api': '',
    },
    changeOrigin: true,
  }));

  // Proxy-passing /ws web-socket requests to /gql endpoint
  app.use(createProxyMiddleware('/ws', {
    target: process.env.SUBSCRIPTION_URL,
    pathRewrite: {
      '^/ws': '',
    },
    ws: true,
    changeOrigin: true,
  }));

  // Proxy for cloud static resources
  app.use(createProxyMiddleware('/cloud-static', {
    target: process.env.CLOUD_STATIC_URL,
    pathRewrite: {
      '^/cloud-static': '',
    },
    changeOrigin: true,
  }));
};
