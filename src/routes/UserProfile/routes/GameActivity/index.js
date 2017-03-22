import { injectReducer } from '../../../../store/reducers';
import { actionCreators } from './modules/index';

export default store => ({
  path: ':id/game-activity',
  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, { key: 'userGamingActivity', reducer: require('./modules/index').default });

    await Promise.all([
      store.dispatch(actionCreators.fetchGames()),
      store.dispatch(actionCreators.fetchGameCategories()),
    ]);

    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-profile-game-activity-view');
  },
});
