export default () => ({
  path: 'reset-password',
  getComponent({ location: { query } }, cb) {
    require.ensure([], (require) => {
      if (!query.token) {
        return cb(null, require('../../routes/NotFound/container/Container').default);
      }

      return cb(null, require('./container/Container').default);
    }, 'reset-password');
  },
});
