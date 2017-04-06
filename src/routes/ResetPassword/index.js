export default store => ({
  path: 'reset-password',
  getComponent({ location: { query } }, cb) {
    require.ensure([], (require) => {
      const { auth: { logged } } = store.getState();

      if (!query.token) {
        return cb(null, require('../../routes/NotFound/container/Container').default);
      }

      if (logged) {
        return cb(null, require('../../routes/Forbidden/container/Container').default);
      }

      return cb(null, require('./container/Container').default);
    }, 'reset-password');
  },
});
