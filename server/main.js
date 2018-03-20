const express = require('express');
const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const logger = require('../build/lib/logger');
const webpackConfig = require('../build/webpack.config');
const project = require('../project.config');
const compress = require('compression');
const proxy = require('express-http-proxy');

const app = express();
app.use(compress());

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig);
  const appConfig = require('./application.config');

  if (process.env.API_ROOT) {
    _.set(appConfig, 'nas.brand.api.url', process.env.API_ROOT);
  }

  if (process.env.GRAPHQL_ROOT) {
    _.set(appConfig, 'nas.graphqlRoot', process.env.GRAPHQL_ROOT);
  }

  if (process.env.BRAND_ID) {
    _.set(appConfig, 'nas.brand.name', process.env.BRAND_ID);
  }

  app.use('/api', proxy(_.get(appConfig, 'nas.brand.api.url')));

  logger.info('Enabling webpack development and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(project.basePath, project.srcDir),
    hot: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: 'normal',
    headers: { 'Access-Control-Allow-Origin': '*' },
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
  }));
  app.get('/config.js', (req, res) => {
    res.contentType('application/javascript');
    res.send(`window.nas = ${JSON.stringify(appConfig)}`);
  });

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(path.resolve(project.basePath, 'public')));

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  logger.warn(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(path.resolve(project.basePath, project.outDir)));
}

module.exports = app;
