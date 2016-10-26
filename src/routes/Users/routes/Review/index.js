import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'review',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'reviewProfilesList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./container/ReviewProfiles').default);
    }, 'in-review-profiles-list');
  },
});
