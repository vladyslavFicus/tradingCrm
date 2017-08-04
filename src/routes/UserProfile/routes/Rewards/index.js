import getChildRoutes from './routes';

export default store => ({
  path: 'rewards',
  onEnter: (nextState, replace, cb) => {
    if (nextState.location && /rewards$/.test(nextState.location.pathname)) {
      replace(`/users/${nextState.params.id}/rewards/bonuses`);
    }

    cb();
  },
  childRoutes: getChildRoutes(store),
});
