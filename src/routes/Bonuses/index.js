import { injectReducer } from 'store/reducers';
import CreateRoute from './routes/Create';

export default (store) => ({
  path: '/bonuses',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'bonusesList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./layouts/Bonuses').default);
    }, 'bonuses-list');
  },

  childRoutes: [
    CreateRoute(store),
  ],
});
