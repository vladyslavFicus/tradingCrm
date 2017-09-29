import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { v4 } from 'uuid';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import timestamp from '../utils/timestamp';
import { actionCreators as authActionCreators, actionTypes as authActionTypes } from '../redux/modules/auth';
import goToSignInPage from '../utils/getSignInUrl';

const LOCK_EVENT_NAME = 'redux.lock';
const UNLOCK_EVENT_NAME = 'redux.unlock';
const UNLOCK_EVENT_RESPONSE_TIMEOUT = 1234;

let __scheduledTokenRefresh = null;
let __logged = false;
let __token = null;
let __pending = false;
let __responsible = false;

const createReleaseLockedQueue = token => ({ next, action: originalAction, resolve }) => {
  let action = originalAction;

  if (isValidRSAA(action)) {
    action = {
      ...originalAction,
      [CALL_API]: {
        ...originalAction[CALL_API],
        headers: {
          ...originalAction[CALL_API].headers,
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }

  const result = next(action);

  if (resolve) {
    resolve(result);
  }
};

const changeReduxLockState = (value, detail = {}) => {
  const locks = [];

  for (let i = 0; i < window.frames.length; i++) {
    if ((/^PLAYER-/).test(window.frames[0].frameElement.id)) {
      locks.push(
        new Promise((resolve) => {
          let timeout = null;
          const uuid = v4();
          const requestEventName = value ? LOCK_EVENT_NAME : UNLOCK_EVENT_NAME;
          const responseEventName = `${requestEventName}ed#${uuid}`;
          const listener = (e) => {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }

            window.removeEventListener(responseEventName, listener);

            resolve(!!e);
          };
          window.addEventListener(responseEventName, listener);

          console.info(`Send event "${requestEventName}" to iframe#${i} - ${window.frames[0].frameElement.id}`);

          window.frames[i].window.dispatchEvent(
            new CustomEvent(requestEventName, {
              detail: {
                ...detail,
                value,
                uuid,
              },
            })
          );

          timeout = setTimeout(listener, UNLOCK_EVENT_RESPONSE_TIMEOUT);
        })
      );
    }
  }

  return Promise.all(locks);
};

function unlockRedux(token) {
  window.reduxLocked = false;

  const releaseLockedQueue = createReleaseLockedQueue(token);
  window.reduxLockedQueue.forEach(releaseLockedQueue);
  window.reduxLockedQueue.splice(0, window.reduxLockedQueue.length);
}

const logout = (store) => {
  store.dispatch({ type: authActionTypes.LOGOUT.SUCCESS });

  const signInUrl = goToSignInPage(store.getState().location);

  if (signInUrl) {
    browserHistory.push(signInUrl);
  }
};

function clearRefreshTokenTask() {
  if (__scheduledTokenRefresh) {
    clearTimeout(__scheduledTokenRefresh);
    __scheduledTokenRefresh = null;
  }
}

const scheduleTokenRefreshTask = (store, token) => {
  if (!token) {
    return logout(store);
  }

  const tokenData = jwtDecode(token);
  const delay = (tokenData.exp - timestamp()) - _.random(45, 65);
  clearRefreshTokenTask();
  console.info(`Scheduled token update in ${delay} seconds`);

  if (delay <= 0) {
    return logout(store);
  }

  __scheduledTokenRefresh = setTimeout(async () => {
    if (!__pending && !__responsible) {
      __responsible = true;
      __pending = true;

      await Promise.all(window.activeConnections);
      await changeReduxLockState(true, { token });
      const refreshTokenAction = await store.dispatch(authActionCreators.refreshToken(token));

      if (!refreshTokenAction || refreshTokenAction.error || !refreshTokenAction.payload.jwtToken) {
        return logout(store, true);
      }

      __token = refreshTokenAction.payload.jwtToken;

      await changeReduxLockState(false, { token: __token });
      unlockRedux(__token);
      scheduleTokenRefreshTask(store, __token);
    }
  }, delay * 1000);
};

const mainStoreListener = store => () => {
  const { auth } = store.getState();

  if (__logged !== auth.logged) {
    if (auth.logged && auth.token !== __token) {
      __logged = auth.logged;
      __token = auth.token;

      scheduleTokenRefreshTask(store, __token);
    } else {
      __logged = false;
      __token = null;
      __pending = false;
      __responsible = false;

      window.reduxLocked = false;
      window.reduxLockedQueue = [];

      clearRefreshTokenTask();
    }
  }

  if (__pending !== auth.refreshingToken) {
    if (auth.refreshingToken) {
      __pending = true;

      if (!__responsible) {
        window.reduxLocked = true;
      }
    } else {
      __pending = false;

      if (!__responsible) {
        __token = auth.token;

        unlockRedux(__token);
        scheduleTokenRefreshTask(store, __token);
      } else {
        __responsible = false;
      }
    }
  }
};

export default ({ store }) => {
  if (window.isFrame) {
    window.addEventListener(LOCK_EVENT_NAME, (e) => {
      window.reduxLocked = true;

      Promise.all(window.activeConnections)
        .then(() => {
          window.parent.dispatchEvent(new CustomEvent(`${LOCK_EVENT_NAME}ed#${e.detail.uuid}`));
        });
    });

    window.addEventListener(UNLOCK_EVENT_NAME, (e) => {
      store.dispatch({ type: authActionTypes.REFRESH_TOKEN.SUCCESS, payload: { jwtToken: e.detail.token } });
      unlockRedux(e.detail.token);

      window.parent.dispatchEvent(new CustomEvent(`${UNLOCK_EVENT_NAME}ed#${e.detail.uuid}`));
    });
  } else {
    store.subscribe(mainStoreListener(store));
  }
};
