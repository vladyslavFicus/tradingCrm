export default () => ({
  path: ':id/settings',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      //cb(null, require('./container/ViewContainer').default);
      cb(null, require('./components/View').default);
    }, 'settings-view');
  },
});
