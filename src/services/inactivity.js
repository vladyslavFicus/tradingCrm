// --------------------- UNUSED NOW ---------------------------- //

import _ from 'lodash';
import history from '../router/history';
import { actionCreators as authActionCreators, actionTypes as authActionTypes } from '../redux/modules/auth';
import { actionCreators as windowActionCreators } from '../redux/modules/window';
import timestamp from '../utils/timestamp';

const STORAGE_KEY = 'last-activity';
const ACTIVITY_EVENTS = 'mousemove';

const logout = (store) => {
  const { auth } = store.getState();

  if (auth.token) {
    store.dispatch(authActionCreators.logout());
  } else {
    store.dispatch({ type: authActionTypes.LOGOUT.SUCCESS });
  }

  const { location } = history;

  if (
    (location && location.pathname && !/(sign-in)/.test(location.pathname))
  ) {
    const returnUrl = location && location.pathname && !/(sign-in)/.test(location.pathname)
      ? location.pathname
      : '';
    history.push(`/sign-in${returnUrl ? `?returnUrl=${returnUrl}` : ''}`);
  }
};

function updateLastActivity() {
  window.localStorage.setItem(STORAGE_KEY, timestamp());
}

export default ({ store, delay = 1200 }) => {
  if (window.isFrame) {
    const activityUpdate = _.debounce(() => {
      window.dispatchAction(windowActionCreators.operatorActivity());
    }, 200);

    window.addEventListener(ACTIVITY_EVENTS, activityUpdate);
  } else {
    let timeout = null;
    let logged = false;

    const deleteTimeout = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };

    const createTimeout = () => {
      deleteTimeout();

      timeout = setTimeout(() => logout(store), delay * 1000);
    };

    const activityUpdate = _.debounce(() => {
      updateLastActivity();

      createTimeout();
    }, 200);

    const updateStorage = (e) => {
      if (e.key === STORAGE_KEY && e.oldValue !== e.newValue) {
        createTimeout();
      }
    };

    store.subscribe(() => {
      const { auth } = store.getState();

      if (logged !== auth.logged) {
        if (auth.logged) {
          logged = true;

          window.addEventListener(ACTIVITY_EVENTS, activityUpdate);
          window.addEventListener('storage', updateStorage);
        } else {
          logged = false;

          window.removeEventListener(ACTIVITY_EVENTS, activityUpdate);
          window.removeEventListener('storage', updateStorage);

          deleteTimeout();
        }
      }
    });
  }
};
