import { injectReducer } from 'store/reducers';

export default store => ({
  path: '/users/review',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'inReviewProfilesList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./container/InReviewProfiles').default);
    }, 'in-review-profiles-list');
  },
});
