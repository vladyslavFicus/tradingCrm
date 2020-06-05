const { whenDev } = require('@craco/craco');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  babel: {
    plugins: ['module:jsx-control-statements'],
  },
  eslint: {
    mode: 'file',
    loaderOptions: (options) => {
      delete options['ignore'];

      return options;
    },
  },
  webpack: {
    plugins: [
      ...whenDev(() => [new HardSourceWebpackPlugin()], []),
    ],
  },
};
