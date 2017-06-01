import { injectReducer } from '../../../../store/reducers';
import { actionCreators } from './modules/index';
import SettingsRoute from './routes/Settings';
import FeedRoute from './routes/Feed';
import { statuses } from '../../constants';

export default store => ({
  path: 'view/:id',

  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, {
      key: 'bonusCampaignView', reducer: require('./modules/index').default,
    });

    const action = await store.dispatch(actionCreators.fetchCampaign(nextState.params.id));

    const lastRouteParam = nextState.location.pathname.split('/').slice(-1)[0];
    if (action && !action.error && ['settings', 'feed'].indexOf(lastRouteParam) === -1) {
      const bonusCampaignStatus = action.payload.state;
      if (bonusCampaignStatus === statuses.DRAFT) {
        replace(`${nextState.location.pathname}/settings`);
      } else {
        replace(`${nextState.location.pathname}/feed`);
      }
    }

    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const bonusCampaign = store.getState().bonusCampaignView;
      if (bonusCampaign && bonusCampaign.error) {
        return cb(null, require('routes/NotFound/container/Container').default);
      }

      cb(null, require('./container/ViewContainer').default);
    }, 'bonus-campaigns-view');
  },
  childRoutes: [
    SettingsRoute(store),
    FeedRoute(store),
  ],
});
