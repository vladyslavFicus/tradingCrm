import getChildRoutes from './routes';

export default store => ({
  path: 'awards',
  onEnter: (nextState, replace, cb) => {
    if (nextState.location && /awards$/.test(nextState.location.pathname)) {
      replace(`/users/${nextState.params.id}/awards/bonuses`);
    }

    cb();
  },
  childRoutes: getChildRoutes(store),
});
