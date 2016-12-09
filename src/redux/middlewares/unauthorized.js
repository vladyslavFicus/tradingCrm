import { browserHistory } from 'react-router';
import { actionTypes } from 'redux/modules/auth';

export default (codes = [401]) => {
  const isValidMiddlewareAction = ({ auth }, action) => {
    return auth.logged && action
      && action.error && action.payload
      && codes.indexOf(action.payload.status) > -1;
  };

  return ({ dispatch, getState }) => next => action => {
    const { auth, location } = getState();

    if (isValidMiddlewareAction({ auth }, action)) {
      console.log(action);
      dispatch({ type: actionTypes.LOGOUT.SUCCESS });

      if (
        !action.meta || !action.meta.ignoreByAuthMiddleware
        || location && location.pathname !== 'sign-in'
      ) {
        browserHistory.push(`/sign-in?returnUrl=${location.pathname}`);
      }
    }

    return next(action);
  };
};
