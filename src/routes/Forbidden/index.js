export default () => ({
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/Container').default);
    }, 'not-found');
  },
});
