import { actionCreators as windowActionCreators } from '../redux/modules/window';

export default (store, basePath = '') => (nextState, replace, callback) => {
  const { auth } = store.getState();

  if (/^\/$/.test(basePath)) {
    basePath = '';
  }

  const signInRoute = `${basePath}/sign-in?returnUrl=${nextState.location.pathname}`;

  if (/logout$/.test(nextState.location.pathname)) {
    return callback();
  }

  if (!auth.logged) {
    if (window && window.parent !== window) {
      window.parent.postMessage(JSON.stringify(windowActionCreators.logout()), window.location.origin);
    } else {
      replace(signInRoute);
    }
  }

  callback();
};
