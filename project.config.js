const ip = require('ip');
const { v4 } = require('uuid');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const COMPANY = process.env.COMPANY || '';

module.exports = {
  /** The environment to use when building the project */
  env: NODE_ENV,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** The name of the directory containing the application source code */
  srcDir: 'src',
  /** The file name of the application's entry point */
  main: 'main',
  /** The name of the directory in which to emit compiled assets */
  outDir: 'dist',
  /** The base path for all projects assets (relative to the website root) */
  publicPath: NODE_ENV === 'development' ? `http://${ip.address()}:${PORT}/` : '/',
  /** Whether to generate sourcemaps */
  sourcemaps: NODE_ENV !== 'development',
  /** A hash map of keys that the compiler should treat as external to the project */
  externals: {},
  company: COMPANY,
  /** A hash map of variables and their values to expose globally */
  globals: {
    __APP_VERSION__: NODE_ENV === 'development' ? 'dev' : v4(),
  },
  /** Whether to enable verbose logging */
  verbose: false,
  /** The list of modules to bundle separately from the core application code */
  vendors: [
    'classnames',
    'country-list',
    'filesize',
    'fingerprintjs2',
    'lodash',
    'react',
    'react-dom',
    'react-router-dom',
    'reactstrap',
  ],
};
