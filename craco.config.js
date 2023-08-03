const { whenDev } = require('@craco/craco');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { getLoader, loaderByName } = require('@craco/craco');
const path = require('path');

const packages = [];
packages.push(path.join(__dirname, 'packages/common'));

module.exports = {
  babel: {
    plugins: ['jsx-control-statements'],
  },
  webpack: {
    plugins: [
      ...whenDev(() => [new HardSourceWebpackPlugin()], []),
    ],
    configure: (webpackConfig, arg) => {
      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(packages);
      }

      return webpackConfig;
    },
  },
};
