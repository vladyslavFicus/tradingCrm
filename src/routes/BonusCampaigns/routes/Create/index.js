import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'create',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'bonusCampaignCreate',
        reducer: require('./modules/create').default,
      });

      cb(null, { content: require('./container/Container').default });
    }, 'bonus-campaigns-create');
  },
});
