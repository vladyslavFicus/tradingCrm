import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: ':id/feed',
  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, { key: 'userFeed', reducer: require('./modules/index').default });

    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-game-activity-view');
  },
});
