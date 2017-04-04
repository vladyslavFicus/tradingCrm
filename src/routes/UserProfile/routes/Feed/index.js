import { injectReducer } from '../../../../store/reducers';
import { actionCreators as feedTypesActionCreators } from './modules/feedTypes';

export default store => ({
  path: ':id/feed',
  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, { key: 'userFeed', reducer: require('./modules').default });

    await store.dispatch(feedTypesActionCreators.fetchFeedTypes(nextState.params.id));
    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-game-activity-view');
  },
});
