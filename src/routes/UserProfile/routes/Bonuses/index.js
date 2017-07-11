import getChildRoutes from './routes';

export default store => ({
  path: ':id/bonuses',
  onEnter: (nextState, replace, cb) => {
    if (nextState.location && /bonuses$/.test(nextState.location.pathname)) {
      replace(`/users/${nextState.params.id}/bonuses/bonus`);
    }

    cb();
  },
  childRoutes: getChildRoutes(store),
});
