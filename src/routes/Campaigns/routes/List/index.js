export default () => ({
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'new-bonus-campaign-list');
  },
});
