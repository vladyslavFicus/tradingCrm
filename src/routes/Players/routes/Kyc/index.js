import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'kyc-requests',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'kycRequests', reducer: require('./modules/list').default });

      cb(null, require('./container/Container').default);
    }, 'kyc-requests');
  },
});
