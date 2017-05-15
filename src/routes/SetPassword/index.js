import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'set-password',
  getComponent({ location: { query } }, cb) {
    require.ensure([], (require) => {
      if (!query.token) {
        return cb(null, require('../../routes/NotFound/container/Container').default);
      }

      injectReducer(store, { key: 'passwordResetView', reducer: require('./modules').default });

      return cb(null, require('./container/Container').default);
    }, 'set-password');
  },
});
