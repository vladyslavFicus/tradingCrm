import { isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { browserHistory } from 'react-router';
import {
  actionCreators as authActionCreators,
} from '../../redux/modules/auth';
import timestamp from '../../utils/timestamp';

const state = {
  pending: false,
  logoutTimer: null,
};

function logout(store) {
  const { auth: { logged, token } } = store.getState();

  if (logged && token) {
    const tokenData = jwtDecode(token);

    if (tokenData.exp - timestamp() <= 0) {
      clearTimeout(state.logoutTimer);
      state.logoutTimer = null;

      browserHistory.push('/logout');
    }
  }
}

export default function ({ expireThreshold = 60 }) {
  return store => next => async (action) => {
    if (!state.pending) {
      const { auth: { logged, token } } = store.getState();

      if (logged && token) {
        const tokenData = jwtDecode(token);
        const time = timestamp();

        if ((tokenData.exp - time) <= expireThreshold && isValidRSAA(action)) {
          console.info('[Token]: Start refreshing...');
          console.log(tokenData.exp - timestamp(), expireThreshold, time, tokenData.exp);

          state.pending = true;

          const responseAction = await next(action);
          const refreshTokenAction = await store.dispatch(authActionCreators.refreshToken());
          console.info('[Token]: Stop refreshing...');
          state.pending = false;

          if (refreshTokenAction && !refreshTokenAction.error) {
            const refreshedTokenData = jwtDecode(refreshTokenAction.payload.jwtToken);
            clearTimeout(state.logoutTimer);
            state.logoutTimer = setTimeout(() => {
              logout(store);
            }, (refreshedTokenData.exp - (timestamp() + 1)) * 1000);
          }

          return responseAction;
        } else if (state.logoutTimer === null) {
          console.log(tokenData.exp - time);
          state.logoutTimer = setTimeout(() => {
            logout(store);
          }, (tokenData.exp - (timestamp() + 1)) * 1000);
        }
      }
    }

    return next(action);
  };
}
