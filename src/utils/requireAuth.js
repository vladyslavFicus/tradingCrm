import { actionCreators as authActionCreators } from '../redux/modules/auth';
import { actionCreators as windowActionCreators } from '../redux/modules/window';

const resolveAuthStatus = store => (resolve) => {
  store.dispatch(authActionCreators.validateToken())
    .then(
      (action) => {
        const unauthorized = (action && action.error && action.payload.status === 401)
          || (action && !action.payload.valid && action.payload.jwtError !== 'JWT_TOKEN_EXPIRED');
        resolve(unauthorized);
      },
      () => resolve(true),
    );
};

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

  return (new Promise(resolveAuthStatus(store)))
    .then((unauthorized) => {
      if (unauthorized) {
        if (window && window.parent !== window) {
          window.parent.postMessage(JSON.stringify(windowActionCreators.logout()), window.location.origin);
        } else {
          replace(signInRoute);
        }
      }

      callback();
    });
};
