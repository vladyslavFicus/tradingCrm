import { argv } from 'yargs';
import _debug from 'debug';
import project from './project';
import webpack from './webpack';

const debug = _debug('app:karma');
debug('Create configuration.');

const karmaConfig = {
  basePath: '../',
  files: [
    {
      pattern: `./${project.dir_test}/test-bundler.js`,
      watched: false,
      served: true,
      included: true,
    },
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha'],
  reporters: ['mocha'],
  preprocessors: {
    [`${project.dir_test}/test-bundler.js`]: ['webpack'],
  },
  browsers: ['PhantomJS'],
  webpack: {
    entry: `./${project.dir_test}/test-bundler.js`,
    devtool: 'cheap-module-source-map',
    resolve: {
      ...webpack.resolve,
      alias: {
        ...webpack.resolve.alias,
        sinon: 'sinon/pkg/sinon.js',
      },
    },
    resolveLoader: {
      moduleExtensions: ['-loader'],
    },
    plugins: webpack.plugins,
    module: {
      noParse: [
        /\/sinon\.js/,
      ],
      rules: webpack.module.rules.concat([
        {
          test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader: 'imports?define=>false,require=>false',
        },
      ]),
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals: {
      ...webpack.externals,
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window',
    },
  },
  webpackMiddleware: {
    noInfo: true,
  },
  coverageReporter: {
    reporters: project.coverage_reporters,
  },
};

// cannot use `export default` because of Karma.
module.exports = cfg => cfg.set(karmaConfig);
