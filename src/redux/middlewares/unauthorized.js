import { browserHistory } from 'react-router';
import { actionTypes } from '../modules/auth';
import { actionTypes as windowActionTypes, actionCreators as windowActionCreators } from '../modules/window';

export default (codes = [401]) => {
  const isValidMiddlewareAction = ({ auth }, action) => auth.logged && action
  && (
    (action.error && action.payload && codes.indexOf(action.payload.status) > -1)
    || action.type === windowActionTypes.LOGOUT
  );

  return ({ dispatch, getState }) => next => (action) => {
    const { auth, location } = getState();

    if (isValidMiddlewareAction({ auth }, action)) {
      if (window && window.parent !== window) {
        window.parent.postMessage(JSON.stringify(windowActionCreators.logout()), window.location.origin);
      } else {
        dispatch({ type: actionTypes.LOGOUT.SUCCESS });

        if (
          !action.meta || !action.meta.ignoreByAuthMiddleware ||
          (location && location.pathname && !/(sign-in)/.test(location.pathname))
        ) {
          browserHistory.push(`/sign-in${location && location.pathname ? `?returnUrl=${location.pathname}` : ''}`);
        }
      }
    }

    return next(action);
  };
};
