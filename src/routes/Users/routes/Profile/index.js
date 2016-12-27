export default (store) => ({
  path: ':id/profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'profile-view');
  },
});
