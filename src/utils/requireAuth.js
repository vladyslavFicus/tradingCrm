import { actionCreators as authActionCreators } from 'redux/modules/auth';

export default (store, basePath = '') => (nextState, replace, callback) => {
  const { auth } = store.getState();

  if (/^\/$/.test(basePath)) {
    basePath = '';
  }

  const signInRoute = {
    pathname: `${basePath}/sign-in`,
    state: {
      nextPathname: {
        pathname: nextState.location.pathname,
        query: nextState.location.query,
        search: nextState.location.search,
      },
    },
  };

  if (/logout$/.test(nextState.location.pathname)) {
    return callback();
  }

  if (!auth.logged) {
    replace(signInRoute);

    return callback();
  }

  const resolveAuthStatus = (resolve) => {
    store.dispatch(authActionCreators.validateToken())
      .then(
        action => resolve(!action || action.error && action.payload.status === 401 || !action.payload.valid),
        () => resolve(true)
      );
  };

  (new Promise(resolveAuthStatus))
    .then((unauthorized) => {
      if (unauthorized) {
        replace(signInRoute);
      }

      callback();
    });
};
