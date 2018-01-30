import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  path: 'settings',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'bonusCampaignSettings', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'bonus-campaign-settings');
  },
});
