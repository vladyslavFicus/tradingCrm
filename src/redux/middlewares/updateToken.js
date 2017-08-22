import { isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { browserHistory } from 'react-router';
import {
  actionCreators as authActionCreators,
} from '../../redux/modules/auth';
import { actionCreators as windowActionCreators } from '../modules/window';
import timestamp from '../../utils/timestamp';
import { actionTypes as locationActionTypes } from '../../redux/modules/location';

const state = {
  pending: false,
  logoutTimeout: null,
};

const logout = () => {
  if (window && window.parent !== window) {
    window.parent.postMessage(JSON.stringify(windowActionCreators.logout()), window.location.origin);
  } else {
    browserHistory.push('/logout');
  }
};

function startTimeout(store, expirationTime) {
  const delay = (expirationTime - (timestamp() + 10)) * 1000;

  if (delay <= 0) {
    logout();
  } else {
    if (state.logoutTimeout) {
      clearTimeout(state.logoutTimeout);
      state.logoutTimeout = null;
    }

    state.logoutTimeout = setTimeout(() => {
      const { auth: { logged, token } } = store.getState();

      if (logged && token) {
        const tokenData = jwtDecode(token);

        if ((tokenData.exp - timestamp()) <= 0) {
          clearTimeout(state.logoutTimeout);
          state.logoutTimeout = null;

          logout();
        } else {
          startTimeout(store, tokenData.exp);
        }
      }
    }, delay);
  }

  console.info(`Will logout in ${delay} ms`);
}

export default function ({ expireThreshold = 60 }) {
  return store => next => async (action) => {
    if (!state.pending && isValidRSAA(action)) {
      const { auth: { logged, token } } = store.getState();

      if (logged && token) {
        const tokenData = jwtDecode(token);
        const isExpired = (tokenData.exp - timestamp()) <= expireThreshold;

        if (isExpired) {
          console.info('[Token]: Start refreshing...');
          state.pending = true;

          const responseAction = await next(action);
          const refreshTokenAction = await store.dispatch(authActionCreators.refreshToken());
          console.info('[Token]: Stop refreshing...');
          state.pending = false;

          if (refreshTokenAction && !refreshTokenAction.error) {
            const refreshedTokenData = jwtDecode(refreshTokenAction.payload.jwtToken);

            startTimeout(store, refreshedTokenData.exp);
          }

          return responseAction;
        } else if (state.logoutTimeout === null) {
          startTimeout(store, tokenData.exp);
        }
      }
    }

    return next(action);
  };
}
