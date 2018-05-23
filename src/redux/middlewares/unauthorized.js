import history from '../../router/history';
import { actionTypes } from '../modules/auth';
import { actionTypes as windowActionTypes, actionCreators as windowActionCreators } from '../modules/window';
import getSignInUrl from '../../utils/getSignInUrl';

export default (codes = [401]) => {
  const isValidMiddlewareAction = ({ auth }, action) => auth.logged && action
    && (
      (action.error && action.payload && codes.indexOf(action.payload.status) > -1)
      || action.type === windowActionTypes.LOGOUT
    );

  return ({ dispatch, getState }) => next => (action) => {
    const { auth } = getState();

    if (isValidMiddlewareAction({ auth }, action)) {
      if (window.isFrame) {
        window.dispatchAction(windowActionCreators.logout());
      } else {
        dispatch({ type: actionTypes.LOGOUT.SUCCESS });
        const signInUrl = getSignInUrl();

        if ((!action.meta || !action.meta.ignoreByAuthMiddleware) && signInUrl) {
          history.push(signInUrl);
        }
      }
    }

    return next(action);
  };
};
