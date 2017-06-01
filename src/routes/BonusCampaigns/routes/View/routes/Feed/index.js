export default () => ({
  path: 'feed',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/View').default);
    }, 'bonus-campaign-feed');
  },
});
