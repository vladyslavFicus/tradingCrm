import fs from 'fs-extra';
import webpack from 'webpack';
import _debug from 'debug';
import webpackConfig from '../config/webpack';
import config from '../config/project';

const debug = _debug('app:bin:compile');
const paths = config.paths;
const webpackDebug = _debug('app:build:webpack-compiler');
const DEFAULT_STATS_FORMAT = config.compiler_stats;

const webpackCompiler = (cfg, statsFormat = DEFAULT_STATS_FORMAT) => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(cfg);

    compiler.run(function (err, stats) {
      const jsonStats = stats.toJson();

      webpackDebug('Webpack compile completed.');
      webpackDebug(stats.toString(statsFormat));

      if (err) {
        webpackDebug('Webpack compiler encountered a fatal error.', err);
        return reject(err);
      } else if (jsonStats.errors.length > 0) {
        webpackDebug('Webpack compiler encountered errors.');
        webpackDebug(jsonStats.errors.join('\n'));
        return reject(new Error('Webpack compiler encountered errors'));
      } else if (jsonStats.warnings.length > 0) {
        webpackDebug('Webpack compiler encountered warnings.');
        webpackDebug(jsonStats.warnings.join('\n'));
      } else {
        webpackDebug('No errors or warnings encountered.');
      }

      resolve(jsonStats);
    });
  });
};

(async function () {
  try {
    debug('Run compiler');
    const stats = await webpackCompiler(webpackConfig);
    if (stats.warnings.length && config.compiler_fail_on_warning) {
      debug('Config set to fail on warning, exiting with status code "1".');
      process.exit(1);
    }

    debug('Copy static assets to dist folder.');
    fs.copySync(paths.base('public'), paths.dist());
  } catch (e) {
    debug('Compiler encountered an error.', e);
    process.exit(1);
  }
}());
