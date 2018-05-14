export default () => ({
  path: 'cms-games',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./container/CmsGamesContainer').default);
    }, 'cms-games-list');
  },
});
