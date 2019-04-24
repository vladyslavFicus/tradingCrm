require('../build/scripts/dotenv');
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const compress = require('compression');
const tokenMiddleware = require('@hrzn/express-token-middleware');
const logger = require('../build/lib/logger');
const webpackConfig = require('../build/config/webpack.dev');
const buildConfig = require('../build/scripts/docker/buildConfig');
const projectConfig = require('../project.config');

const PORT = process.env.PORT || 3000;

logger.info(`App version: ${projectConfig.globals.__APP_VERSION__}`);

const start = async () => {
  const app = express();

  app.use(compress());

  if (projectConfig.env === 'development') {
    const compiler = webpack(webpackConfig);

    const config = await buildConfig();

    const rewriteProxy = [];

    // for local development
    if (process.env.GRAPHQL_ROOT) {
      rewriteProxy.push({ regexp: /\/gql/, url: process.env.GRAPHQL_ROOT });
    }

    const versionMiddleware = (req, res, next) => {
      const clientVersion = req.get('x-client-version');

      if (clientVersion && clientVersion !== config.version) {
        console.log('IN LOCAL? NO WAY');
        return res.status(426).send();
      }

      return next();
    };

    app.use('/api', versionMiddleware, tokenMiddleware({ apiUrl: config.apiRoot, rewriteProxy, limit: '50mb' }));

    logger.info('Enabling webpack development and HMR middleware');

    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      contentBase: path.resolve(projectConfig.basePath, projectConfig.srcDir),
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
      res.send(`window.nas = ${JSON.stringify(config)}`);
    });

    // Serve static assets from ~/public since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(express.static(path.resolve(projectConfig.basePath, 'public')));

    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.
    app.use('*', (req, res, next) => {
      const filename = path.join(compiler.options.output.path, 'index.html');

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
    logger.warn('Server is being run outside of live development mode, meaning it will ' +
      'only serve the compiled application bundle in ~/dist. Generally you ' +
      'do not need an application server for this and can instead use a web ' +
      'server such as nginx to serve your static files. See the "deployment" ' +
      'section in the README for more information on deployment strategies.');

    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
    app.use(express.static(path.resolve(projectConfig.basePath, projectConfig.outDir)));
  }

  app.listen(PORT, () => {
    logger.success(`Server is running at http://localhost:${PORT}`);
  });
};

start();
