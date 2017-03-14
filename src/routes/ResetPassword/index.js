import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'reset-password',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'passwordResetView', reducer: require('./modules').default });
      cb(null, require('./containers/Container').default);
    }, 'sign-in');
  },
});
