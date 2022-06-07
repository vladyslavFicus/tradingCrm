const { whenDev } = require('@craco/craco');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  babel: {
    plugins: ['jsx-control-statements'],
  },
  webpack: {
    plugins: [
      ...whenDev(() => [new HardSourceWebpackPlugin()], []),
    ],
  },
};
