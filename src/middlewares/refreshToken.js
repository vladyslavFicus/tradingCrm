import jwtDecode from 'jwt-decode';
import {
  actionTypes as authActionTypes,
  actionCreators as authActionCreators
} from 'redux/modules/auth';

const allowedTypes = [authActionTypes.REFRESH_TOKEN_SUCCESS, authActionTypes.LOGIN_SUCCESS];

export default function () {
  let initializationRefresh = false;
  let lastRefreshTimeout = null;

  const scheduleRefreshToken = (dispatch, token) => {
    if (!token) {
      return false;
    }

    if (lastRefreshTimeout !== null) {
      clearTimeout(lastRefreshTimeout);
      lastRefreshTimeout = null;
    }

    const data = jwtDecode(token);
    const timeout = (data.exp * 1000 - Date.now()) - (60 * 1000);

    console.info('Token will be refresh in: ', timeout);
    lastRefreshTimeout = setTimeout(() => {
      console.info('Token refresh started');
      clearTimeout(lastRefreshTimeout);
      lastRefreshTimeout = null;
      dispatch(authActionCreators.refreshToken());
    }, timeout);

    return true;
  };

  return ({ dispatch, getState }) => next => action => {
    if (lastRefreshTimeout === null && !initializationRefresh) {
      scheduleRefreshToken(dispatch, getState().auth.token);
      initializationRefresh = true;
    } else if (allowedTypes.indexOf(action.type) > -1) {
      console.info('Trying to schedule token refresh.');
      const token = action.type === authActionTypes.REFRESH_TOKEN_SUCCESS ?
        action.response.jwtToken : action.response.token;

      scheduleRefreshToken(dispatch, token);
    }

    return next(action);
  }
};
