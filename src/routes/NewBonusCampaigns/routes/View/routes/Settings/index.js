export default () => ({
  path: 'settings',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/SettingsContainer').default);
    }, 'bonus-campaign-settings');
  },
});
