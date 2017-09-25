import getChildRoutes from './routes';

export default store => ({
  path: 'transactions',
  onEnter: (nextState, replace, cb) => {
    if (nextState.location && /transactions$/.test(nextState.location.pathname)) {
      replace(`/users/${nextState.params.id}/transactions/payments`);
    }

    cb();
  },
  childRoutes: getChildRoutes(store),
});

