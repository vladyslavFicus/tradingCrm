import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'kyc', reducer: require('./modules/kyc').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'profile-view');
  },
});
