export default () => ({
  path: 'create',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/CreateContainer').default);
    }, 'bonus-campaign-fulfillments-create');
  },
});
