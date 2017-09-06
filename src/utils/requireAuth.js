import { actionCreators as windowActionCreators } from '../redux/modules/window';
import getSignInUrl from './getSignInUrl';

export default (store, basePath = '') => (nextState, replace, callback) => {
  const { auth } = store.getState();

  if (/^\/$/.test(basePath)) {
    basePath = '';
  }

  const signInUrl = getSignInUrl(nextState.location);

  if (!signInUrl) {
    return callback();
  }

  if (!auth.logged) {
    if (window.isFrame) {
      window.dispatchAction(windowActionCreators.logout());
    } else {
      replace(`${basePath}${signInUrl}`);
    }
  }

  callback();
};
