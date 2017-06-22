import { isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { browserHistory } from 'react-router';
import {
  actionCreators as authActionCreators,
} from '../../redux/modules/auth';
import timestamp from '../../utils/timestamp';

const state = {
  pending: false,
  logoutTimeout: null,
};

function startTimeout(store, delay) {
  if (state.logoutTimeout) {
    clearTimeout(state.logoutTimeout);
    state.logoutTimeout = null;
  }

  state.logoutTimeout = setTimeout(() => {
    const { auth: { logged, token } } = store.getState();

    if (logged && token) {
      const tokenData = jwtDecode(token);

      if (tokenData.exp - timestamp() <= 0) {
        clearTimeout(state.logoutTimeout);
        state.logoutTimeout = null;

        browserHistory.push('/logout');
      } else {
        startTimeout(store, (tokenData.exp - (timestamp() + 1)) * 1000);
      }
    }
  }, delay);

  console.info(`Will logout in ${delay} ms`);
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

            startTimeout(store, (refreshedTokenData.exp - (timestamp() + 1)) * 1000);
          }

          return responseAction;
        } else if (state.logoutTimeout === null) {
          startTimeout(store, (tokenData.exp - (timestamp() + 1)) * 1000);
        }
      }
    }

    return next(action);
  };
}
