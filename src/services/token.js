import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { v4 } from 'uuid';
import timestamp from '../utils/timestamp';
import { actionCreators as authActionCreators } from '../redux/modules/auth';

let __scheduledTokenRefresh = null;
let __logged = false;
let __token = null;
const LOCK_EVENT_NAME = 'redux.lock';
const UNLOCK_EVENT_NAME = 'redux.unlock';
const UNLOCK_EVENT_RESPONSE_TIMEOUT = 1234;

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

const scheduleTokeRefreshTask = (store, token) => {
  const tokenData = jwtDecode(token);
  const delay = (tokenData.exp - timestamp()) - 60;
  console.log(`Scheduled token update in ${delay}`);

  __scheduledTokenRefresh = setTimeout(async () => {
    await changeReduxLockState(true, { token });
    const action = await store.dispatch(authActionCreators.refreshToken(token));

    if (!action || action.error) {
      return;
    }

    await changeReduxLockState(false, { token: action.payload.jwtToken });

    scheduleTokeRefreshTask(store, action.payload.jwtToken);
  }, delay * 1000);
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

      scheduleTokeRefreshTask(store, __token);
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
      window.reduxLocked = false;

      window.reduxLockedQueue.forEach(({ next, action: originalAction, resolve }) => {
        let action = originalAction;

        if (isValidRSAA(action)) {
          action = {
            ...originalAction,
            [CALL_API]: {
              ...originalAction[CALL_API],
              headers: {
                ...originalAction[CALL_API].headers,
                Authorization: `Bearer ${e.detail.token}`,
              },
            },
          };
        }

        const result = next(action);

        if (resolve) {
          resolve(result);
        }
      });

      window.reduxLockedQueue.splice(0, window.reduxLockedQueue.length);
      window.parent.dispatchEvent(new CustomEvent(`${UNLOCK_EVENT_NAME}ed#${e.detail.uuid}`));
    });
  } else {
    store.subscribe(mainStoreListener(store));
  }
};
