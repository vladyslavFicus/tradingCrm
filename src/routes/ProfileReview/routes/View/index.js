import { injectReducer } from 'store/reducers';

export default store => ({
  path: ':uuid',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'userReviewView',
        reducer: require('./modules/index').default,
      });
      cb(null, { content: require('./container/View').default });
    }, 'kyc-list');
  },
});
