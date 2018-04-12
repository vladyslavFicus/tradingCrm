export default () => ({
  path: 'create',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/CampaignCreateContainer').default);
    }, 'new-bonus-campaign-list');
  },
});
