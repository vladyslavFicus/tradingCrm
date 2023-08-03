const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  // Proxy-passing /api requests to graphql server /api endpoint
  app.use(createProxyMiddleware('/api', {
    target: process.env.API_URL,
    changeOrigin: true,
  }));

  // Proxy-passing /ws web-socket requests to /ws endpoint
  app.use(createProxyMiddleware('/ws', {
    target: process.env.SUBSCRIPTION_URL,
    ws: true,
    changeOrigin: true,
  }));

  // Proxy-passing /rsocket web-socket (rsocket) requests to /we-trading-socket-gateway endpoint
  app.use(createProxyMiddleware('/rsocket', {
    target: process.env.RSOCKET_URL,
    headers: {
      Connection: 'keep-alive',
    },
    pathRewrite: {
      '^/rsocket': '',
    },
    ws: true,
    changeOrigin: true,
    onProxyReqWs(proxyReq, req, socket) {
      socket.on('error', () => {
        // Skip to do something to prevent webpack-dev-server crashing
      });
    },
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
