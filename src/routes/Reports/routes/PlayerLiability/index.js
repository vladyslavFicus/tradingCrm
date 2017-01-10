import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'player-liability',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'playerLiabilityReport',
        reducer: require('./modules/index').default,
      });

      cb(null, require('./container/Container').default);
    }, 'player-liability-report');
  },
});
