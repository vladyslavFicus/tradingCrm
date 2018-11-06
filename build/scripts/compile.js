const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const logger = require('../lib/logger');
const webpackConfig = require('../config/webpack.prod');
const project = require('../../project.config');

logger.info(`App version: ${project.globals.__APP_VERSION__}`);

const runWebpackCompiler = webpackConfig =>
  new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        logger.error('Webpack compiler encountered a fatal error.', err);
        return reject(err);
      }

      const jsonStats = stats.toJson();
      if (jsonStats.errors.length > 0) {
        logger.error('Webpack compiler encountered errors.');
        logger.log(jsonStats.errors.join('\n'));
        return reject(new Error('Webpack compiler encountered errors'));
      } else if (jsonStats.warnings.length > 0) {
        logger.warn('Webpack compiler encountered warnings.');
        logger.log(jsonStats.warnings.join('\n'));
      }
      resolve(stats);
    });
  });

const compile = () => Promise.resolve()
  .then(() => logger.info('Starting compiler...'))
  .then(() => logger.info(`Target application environment: ${chalk.bold(project.env)}`))
  .then(() => runWebpackCompiler(webpackConfig))
  .then((stats) => {
    logger.info(`Copying static assets from ./public to ./${project.outDir}.`);
    fs.copySync(path.resolve(project.basePath, 'public'), path.resolve(project.basePath, project.outDir));

    return stats;
  })
  .then((stats) => {
    if (project.verbose) {
      logger.log(stats.toString({
        colors: true,
        chunks: false,
      }));
    }
    logger.success(`Compiler finished successfully! See ./${project.outDir}.`);
  })
  .then(() => {
    const filePath = path.resolve(project.basePath, project.outDir, 'VERSION');
    logger.info(`Create file with app version (./${project.outDir}/VERSION)`);

    fs.writeFileSync(filePath, project.globals.__APP_VERSION__);
  })
  .catch((err) => {
    logger.error('Compiler encountered errors.', err);
    process.exit(1);
  });

compile();
