import { injectReducer } from 'store/reducers';
import { actionCreators } from './modules/view';

export default (store) => ({
  path: ':id/game-activity',
  onEnter: (nextState, replace, callback) => {
    injectReducer(store, { key: 'userGameActivity', reducer: require('./modules/view').default });

    store.dispatch(actionCreators.fetchGames())
      .then(() => callback());
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'game-activity-view');
  },
});
