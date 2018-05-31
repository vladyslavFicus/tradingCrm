const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const project = require('../../project.config');

process.traceDeprecation = true;

const SRC_DIR = path.resolve(project.basePath, 'src');
const company = project.company !== 'nas' ? project.company : '';
const __DEV__ = project.env === 'development';
const __TEST__ = project.env === 'test';
const __PROD__ = project.env === 'production';

module.exports = {
  entry: [
    path.join(SRC_DIR, project.main),
  ],
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
  },
  module: {
    rules: [
      // js
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(project.basePath, 'node_modules'),
        use: 'happypack/loader',
      },
      { test: /\.(js|jsx)$/,
        loader: 'webpack-enhanced-brand-loader',
        exclude: path.resolve(project.basePath, 'node_modules'),
        options: {
          brand: company,
        },
      },
      // images
      {
        test: /\.(png|ico|gif|svg|jpe?g)(\?[a-z0-9]+)?$/,
        use: 'url-loader',
      },
      // fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['url-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(project.env),
      __DEV__,
      __PROD__,
      __TEST__,

    }),
    new HappyPack({
      threads: 4,
      loaders: [{
        loader: 'babel-loader',
        query: {
          plugins: [
            'babel-plugin-transform-class-properties',
            'babel-plugin-syntax-dynamic-import',
            'jsx-control-statements', [
              'babel-plugin-transform-runtime',
              {
                helpers: true,
                polyfill: true,
                regenerator: true,
              },
            ],
            [
              'babel-plugin-transform-object-rest-spread',
              {
                useBuiltIns: true, // we polyfill Object.assign in src/normalize.js
              },
            ],
          ],
          presets: [
            'babel-preset-react', ['babel-preset-env', {
              targets: {
                ie9: true,
              },
              uglify: true,
            }],
          ],
        },
      }],
    }),
    new HtmlWebpackPlugin({
      template: path.join(SRC_DIR, 'index.html'),
      inject: true,
      minify: {
        collapseWhitespace: true,
      },
    }),
  ],
};
