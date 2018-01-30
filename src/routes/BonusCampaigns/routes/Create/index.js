import { injectReducer } from '../../../../store/reducers';
import SettingsRoute from './routes/Settings';
import FeedRoute from './routes/Feed';

export default store => ({
  path: 'create',

  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, {
      key: 'bonusCampaignView', reducer: require('./modules').default,
    });

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
