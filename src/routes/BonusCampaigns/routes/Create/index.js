import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: '/bonus-campaigns/create',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'bonusCampaignCreate',
        reducer: require('./modules/campaign').default,
      });

      cb(null, { content: require('./container/Container').default });
    }, 'bonus-campaigns-create');
  },
});
