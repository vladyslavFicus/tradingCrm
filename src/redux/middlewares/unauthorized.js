import { browserHistory } from 'react-router';
import { actionTypes } from '../modules/auth';

export default (codes = [401]) => {
  const isValidMiddlewareAction = ({ auth }, action) => auth.logged && action
      && action.error && action.payload
      && codes.indexOf(action.payload.status) > -1;

  return ({ dispatch, getState }) => next => (action) => {
    const { auth, location } = getState();

    if (isValidMiddlewareAction({ auth }, action)) {
      dispatch({ type: actionTypes.LOGOUT.SUCCESS });

      if (
        !action.meta || !action.meta.ignoreByAuthMiddleware
        || location && location.pathname !== 'sign-in'
      ) {
        browserHistory.push(`/sign-in${location && location.pathname ? `?returnUrl=${location.pathname}` : ''}`);
      }
    }

    return next(action);
  };
};
