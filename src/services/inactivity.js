import { browserHistory } from 'react-router';
import _ from 'lodash';
import { actionTypes as authActionTypes } from '../redux/modules/auth';
import { actionCreators as windowActionCreators } from '../redux/modules/window';

const events = 'mousemove';
export default ({ store, delay = 600 }) => {
  if (window.isFrame) {
    const activityUpdate = _.debounce(() => { window.dispatchAction(windowActionCreators.operatorActivity()); }, 200);

    window.addEventListener(events, activityUpdate);
  } else {
    let timeout = null;
    let logged = false;
    const activityUpdate = _.debounce(() => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        store.dispatch({ type: authActionTypes.LOGOUT.SUCCESS });
        const { location } = store.getState();

        if (
          (location && location.pathname && !/(sign-in)/.test(location.pathname))
        ) {
          const returnUrl = location && location.pathname && !/(sign-in)/.test(location.pathname)
            ? location.pathname
            : '';
          browserHistory.push(`/sign-in${returnUrl ? `?returnUrl=${returnUrl}` : ''}`);
        }
      }, delay * 1000);
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
        }
      }
    });
  }
};
