const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['raw-loader'],
        }),
      },
      // sass
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: project.sourcemaps,
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
                  sourcemap: project.sourcemaps,
                },
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
        }),
        include: [
          SRC_DIR,
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
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
    new ExtractTextPlugin({
      filename: 'styles/[name].[hash].css',
      allChunks: true,
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

