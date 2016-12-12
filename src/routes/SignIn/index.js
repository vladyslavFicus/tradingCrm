export default (store) => ({
  path: 'sign-in',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./containers/SignInContainer').default);
    }, 'sign-in');
  },
});
