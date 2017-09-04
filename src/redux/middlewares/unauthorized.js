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
      if (window.isFrame) {
        window.dispatchAction(windowActionCreators.logout());
      } else {
        dispatch({ type: actionTypes.LOGOUT.SUCCESS });

        if (
          !action.meta || !action.meta.ignoreByAuthMiddleware ||
          (location && location.pathname && !/(sign-in)/.test(location.pathname))
        ) {
          const returnUrl = location && location.pathname && !/(sign-in)/.test(location.pathname)
            ? location.pathname
            : '';
          browserHistory.push(`/sign-in${returnUrl ? `?returnUrl=${returnUrl}` : ''}`);
        }
      }
    }

    return next(action);
  };
};
