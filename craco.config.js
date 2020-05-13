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
};
