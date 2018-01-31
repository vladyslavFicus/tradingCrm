import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'create',

  onEnter: async (nextState, replace, callback) => {
    injectReducer(store, {
      key: 'bonusCampaignCreate', reducer: require('./modules').default,
    });

    callback();
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'bonus-campaigns-view');
  },
});
