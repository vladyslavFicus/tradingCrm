const argv = require('yargs').argv;
const webpackConfig = require('./config/webpack.prod');

const TEST_BUNDLER = './tests/test-bundler.js';

const karmaConfig = {
  basePath: '../',
  browsers: ['PhantomJS'],
  singleRun: !argv.watch,
  coverageReporter: {
    reporters: [
      { type: 'text-summary' },
    ],
  },
  files: [
    './node_modules/babel-polyfill/dist/polyfill.js',
    './node_modules/phantomjs-polyfill/bind-polyfill.js',
    {
      pattern: TEST_BUNDLER,
      watched: false,
      served: true,
      included: true,
    },
  ],
  frameworks: ['mocha'],
  reporters: ['mocha'],
  preprocessors: {
    [TEST_BUNDLER]: ['webpack'],
  },
  logLevel: 'WARN',
  browserConsoleLogOptions: {
    terminal: true,
    format: '%b %T: %m',
    level: '',
  },
  webpack: {
    entry: TEST_BUNDLER,
    devtool: 'cheap-module-source-map',
    module: webpackConfig.module,
    plugins: webpackConfig.plugins,
    resolve: webpackConfig.resolve,
    externals: {
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react',
    },
  },
  webpackMiddleware: {
    stats: 'errors-only',
    noInfo: true,
  },
};

if (argv.reporter === 'jenkins') {
  karmaConfig.singleRun = true;
  karmaConfig.reporters = ['dots', 'junit'];
  karmaConfig.junitReporter = {
    outputDir: 'tests',
    outputFile: 'test-results.xml',
    useBrowserName: false,
  };
}

module.exports = cfg => cfg.set(karmaConfig);
