export default () => ({
  path: 'profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'profile-view');
  },
});
