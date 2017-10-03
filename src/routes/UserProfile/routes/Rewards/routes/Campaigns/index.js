import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  path: 'campaigns',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'playerBonusCampaignsList', reducer: require('./modules').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'user-bonus-campaign-list');
  },
});
