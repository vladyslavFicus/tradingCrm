const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common.js');
const project = require('../../project.config');

const SRC_DIR = path.resolve(project.basePath, 'src');
const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  target: 'web',
  output: {
    path: path.resolve(project.basePath, project.outDir),
    publicPath: project.publicPath,
    filename: '[name].js?[chunkhash]',
    chunkFilename: '[name].js?[chunkhash]',
  },
  module: {
    rules: [
      // sass
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: project.sourcemaps,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(),
                require('cssnano')(),
              ],
            },
          },
          {
            loader: 'fast-sass-loader',
            options: {
              sourceMap: project.sourcemaps,
              includePaths: [
                path.join(SRC_DIR, 'styles'),
              ],
            },
          },
        ],
        include: [
          SRC_DIR,
        ],
        exclude: /node_modules/,
      },
      // css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'main',
          test: /\.css$/,
          enforce: true,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: project.sourcemaps,
        uglifyOptions: {
          ecma: 8,
          compress: {
            unused: true,
            dead_code: true,
            pure_getters: false,
            warnings: false,
            conditionals: true,
            comparisons: true,
            sequences: true,
            evaluate: true,
            join_vars: true,
            if_return: true,
          },
          output: {
            comments: false,
          },
          mangle: {
            safari10: true,
          },
        },
      }),
    ],
  },
  plugins: [
    // clean dist folder
    new CleanWebpackPlugin(['dist'], {
      root: project.basePath,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css?[hash]',
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};

if (process.env.NODE_ANALYZE) {
  prodConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(common, prodConfig);

