import { browserHistory } from 'react-router';
import _ from 'lodash';
import { actionCreators as authActionCreators, actionTypes as authActionTypes } from '../redux/modules/auth';
import { actionCreators as windowActionCreators } from '../redux/modules/window';
import timestamp from '../utils/timestamp';

const events = 'mousemove';
const logout = (store) => {
  const { location, auth } = store.getState();

  if (auth.token) {
    store.dispatch(authActionCreators.logout());
  } else {
    store.dispatch({ type: authActionTypes.LOGOUT.SUCCESS });
  }

  if (
    (location && location.pathname && !/(sign-in)/.test(location.pathname))
  ) {
    const returnUrl = location && location.pathname && !/(sign-in)/.test(location.pathname)
      ? location.pathname
      : '';
    browserHistory.push(`/sign-in${returnUrl ? `?returnUrl=${returnUrl}` : ''}`);
  }
};
export default ({ store, delay = 1200 }) => {
  if (window.isFrame) {
    const activityUpdate = _.debounce(() => {
      window.dispatchAction(windowActionCreators.operatorActivity());
    }, 200);

    window.addEventListener(events, activityUpdate);
  } else {
    let timeout = null;
    let logged = false;
    let lastActivity = null;
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
      store.dispatch(authActionCreators.setLastActivity(timestamp()));

      createTimeout();
    }, 200);

    store.subscribe(() => {
      const { auth } = store.getState();

      if (logged !== auth.logged) {
        if (auth.logged) {
          logged = true;
          window.addEventListener(events, activityUpdate);
        } else {
          logged = false;
          window.removeEventListener(events, activityUpdate);

          deleteTimeout();
        }
      }

      if (auth.logged) {
        if (lastActivity !== auth.lastActivity) {
          lastActivity = auth.lastActivity;

          createTimeout();
        }
      }
    });
  }
};
