// Sync route definition
export default () => ({
  path: '/',
  onEnter(nextState, replace, cb) {
    replace({ pathname: '/users/list' });
    cb();
  },
});
