import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { v4 } from 'uuid';
import { browserHistory } from 'react-router';
import timestamp from '../utils/timestamp';
import { actionCreators as authActionCreators, actionTypes as authActionTypes } from '../redux/modules/auth';
import goToSignInPage from '../utils/getSignInUrl';

let __scheduledTokenRefresh = null;
let __logged = false;
let __token = null;
const LOCK_EVENT_NAME = 'redux.lock';
const UNLOCK_EVENT_NAME = 'redux.unlock';
const UNLOCK_EVENT_RESPONSE_TIMEOUT = 1234;

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

const logout = (store) => {
  store.dispatch({ type: authActionTypes.LOGOUT.SUCCESS });

  const signInUrl = goToSignInPage(store.getState().location);

  if (signInUrl) {
    browserHistory.push(signInUrl);
  }
};

const scheduleTokenRefreshTask = (store, token) => {
  const tokenData = jwtDecode(token);
  const delay = (tokenData.exp - timestamp()) - 60;
  console.log(`Scheduled token update in ${delay}`);

  if (delay > 0) {
    __scheduledTokenRefresh = setTimeout(async () => {
      window.reduxLocked = true;
      await changeReduxLockState(true, { token });
      const refreshTokenAction = await store.dispatch(authActionCreators.refreshToken(token));

      if (!refreshTokenAction || refreshTokenAction.error) {
        logout(store);
      } else {
        window.reduxLocked = false;

        await changeReduxLockState(false, { token: refreshTokenAction.payload.jwtToken });

        const releaseLockedQueue = createReleaseLockedQueue(refreshTokenAction.payload.jwtToken);
        window.reduxLockedQueue.forEach(releaseLockedQueue);
        window.reduxLockedQueue.splice(0, window.reduxLockedQueue.length);

        scheduleTokenRefreshTask(store, refreshTokenAction.payload.jwtToken);
      }
    }, delay * 1000);
  } else {
    logout(store);
  }
};

const clearRefreshTokenTask = () => {
  if (__scheduledTokenRefresh) {
    clearTimeout(__scheduledTokenRefresh);
    __scheduledTokenRefresh = null;
  }
};

const mainStoreListener = store => () => {
  const { auth } = store.getState();

  if (__logged !== auth.logged) {
    if (auth.logged && auth.token) {
      __logged = auth.logged;
      __token = auth.token;

      scheduleTokenRefreshTask(store, __token);
    } else {
      clearRefreshTokenTask();
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
      window.reduxLocked = false;

      const releaseLockedQueue = createReleaseLockedQueue(e.detail.token);
      window.reduxLockedQueue.forEach(releaseLockedQueue);
      window.reduxLockedQueue.splice(0, window.reduxLockedQueue.length);

      window.parent.dispatchEvent(new CustomEvent(`${UNLOCK_EVENT_NAME}ed#${e.detail.uuid}`));
    });
  } else {
    store.subscribe(mainStoreListener(store));
  }
};
