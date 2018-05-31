const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const common = require('./webpack.common.js');
const project = require('../../project.config');

const SRC_DIR = path.resolve(project.basePath, 'src');

module.exports = merge(common, {
  mode: 'development',
  devtool: false,
  entry: [
    `webpack-hot-middleware/client.js?path=${project.publicPath}__webpack_hmr`,
  ],
  output: {
    path: path.resolve(project.basePath, project.outDir),
    publicPath: project.publicPath,
    filename: '[name].js?[hash]',
  },
  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: [
          'style-loader',
          'raw-loader',
        ],
      },
      // sass
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              options: {
                sourceMap: false,
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                  discardComments: {
                    removeAll: true,
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourcemap: true,
                },
              },

            },
          },
          {
            loader: 'fast-sass-loader',
            options: {
              sourcemap: true,
              includePaths: [
                path.join(SRC_DIR, project.main),
              ],
              exclude: /node_modules/,
            },
          },
        ],
      },

    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: 'Build [:bar] :percent (:elapsed seconds)',
      clear: false,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
