import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'set-password',
  getComponent({ location: { query } }, cb) {
    require.ensure([], (require) => {
      const { auth: { logged } } = store.getState();

      if (!query.token) {
        return cb(null, require('../../routes/NotFound/container/Container').default);
      }

      if (logged) {
        return cb(null, require('../../routes/Forbidden/container/Container').default);
      }

      injectReducer(store, { key: 'passwordResetView', reducer: require('./modules').default });

      return cb(null, require('./containers/Container').default);
    }, 'set-password');
  },
});
