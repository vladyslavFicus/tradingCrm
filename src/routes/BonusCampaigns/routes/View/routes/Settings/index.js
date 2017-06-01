export default () => ({
  path: 'settings',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'bonus-campaign-settings');
  },
});
