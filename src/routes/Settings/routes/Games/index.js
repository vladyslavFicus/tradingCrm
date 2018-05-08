import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'games',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'games', reducer: require('./modules').default });

      cb(null, require('./container/GameListContainer').default);
    }, 'games-list');
  },
});
