import webpack from 'webpack';
import cssnano from 'cssnano';
import _debug from 'debug';
import { argv } from 'yargs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import project from './project';

const debug = _debug('app:config:webpack');
const { __DEV__, __PROD__, __TEST__ } = project.globals;

debug('Creating configuration.');
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: project.compiler_devtool,
  resolve: {
    modules: [
      project.paths.client(),
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  module: {
    noParse: /node_modules\/quill\/dist\/quill\.js/,
  },
};

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.js');

webpackConfig.entry = {
  app: __DEV__
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor: project.compiler_vendor,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[${project.compiler_hash_type}].js`,
  path: project.paths.dist(),
  publicPath: project.compiler_public_path,
  sourceMapFilename: '[name].[hash].js.map',
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: __dirname,
      postcss: [
        cssnano({
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
        }),
      ],
      sassLoader: {
        includePaths: project.paths.client('styles'),
      },
    },
  }),
  new HtmlWebpackPlugin({
    template: project.paths.client('index.html'),
    hash: false,
    favicon: project.paths.public('favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true,
    },
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: project.paths.client(),
      output: {
        path: project.paths.dist(),
      },
    },
  }),
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map(err => err.message || err),
        );
      }
    });
  });
}

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', (stats) => {
      const errors = [];
      if (stats.compilation.errors.length) {
        // Log each of the warnings
        stats.compilation.errors.forEach((error) => {
          errors.push(error.message || error);
        });

        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(errors);
      }
    });
  });
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  );
} else if (__PROD__) {
  debug('Enable plugins for production (UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    }),
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      cacheDirectory: true,
      plugins: ['transform-runtime'],
      presets: ['es2015', 'react', 'stage-0'],
      env: {
        production: {
          presets: ['react-optimize'],
        },
      },
    },
  },
];

// ------------------------------------
// Style Loaders
// ------------------------------------
const BASE_CSS_LOADER = {
  loader: 'css',
  query: {
    sourceMap: true,
    minimize: true,
  },
};

webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [{
    loader: 'style',
  }, BASE_CSS_LOADER, {
    loader: 'postcss',
  }, {
    loader: 'sass',
  }],
});

webpackConfig.module.rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style' },
    BASE_CSS_LOADER,
    { loader: 'postcss' },
  ],
});

// File loaders
/* eslint-disable */
webpackConfig.module.rules.push(
  {
    test: /\.woff(\?.*)?$/,
    use: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff',
  },
  {
    test: /\.woff2(\?.*)?$/,
    use: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2',
  },
  {
    test: /\.otf(\?.*)?$/,
    loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype',
  },
  {
    test: /\.ttf(\?.*)?$/,
    loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.eot(\?.*)?$/,
    loader: 'file?prefix=fonts/&name=[path][name].[ext]',
  },
  {
    test: /\.svg(\?.*)?$/,
    loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml',
  },
  {
    test: /\.(png|jpg|gif)$/,
    loader: 'file?name=[name].[ext]?[hash]',
  }
);
/* eslint-enable */

if (!__DEV__) {
  debug('Applying ExtractTextPlugin to CSS loaders.');

  webpackConfig.module.rules
    .filter(rule => Array.isArray(rule.use) && rule.use.some(use => use.loader && /css/.test(use.loader)))
    .map((rule) => {
      const [first, ...rest] = rule.use;

      return {
        ...rule,
        loader: ExtractTextPlugin.extract({
          fallback: first,
          use: rest,
        }),
      };
    });

  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    }),
  );
}

module.exports = webpackConfig;
