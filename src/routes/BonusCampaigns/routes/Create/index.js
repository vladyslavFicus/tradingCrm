import { injectReducer } from '../../../../store/reducers';
import SettingsRoute from './routes/Settings';
import FeedRoute from './routes/Feed';

export default store => ({
  path: 'create',

  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, {
      key: 'bonusCampaignCreate', reducer: require('./modules').default,
    });

    const lastRouteParam = nextState.location.pathname.split('/').slice(-1)[0];

    if (['settings', 'feed'].indexOf(lastRouteParam) === -1) {
      replace(`${nextState.location.pathname}/settings`);
    }

    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'bonus-campaigns-view');
  },
  childRoutes: [
    SettingsRoute(store),
    FeedRoute(store),
  ],
});
