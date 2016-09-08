import { injectReducer } from 'store/reducers';
import CreateRoute from './routes/Create';

export default (store) => ({
  path: '/bonus-campaigns',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'bonusCampaignsList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./container/Campaigns').default);
    }, 'bonus-campaigns-list');
  },

  childRoutes: [CreateRoute(store)],
});
