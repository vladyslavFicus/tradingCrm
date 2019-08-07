import history from '../router/history';
import { actionTypes as windowActionTypes } from '../redux/modules/window';
import parseJson from '../utils/parseJson';

export default (store) => {
  if (window) {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const action = parseJson(data, null);

          if (action && Object.values(windowActionTypes).indexOf(action.type) > -1) {
            if (action.type === windowActionTypes.OPERATOR_ACTIVITY) {
              window.dispatchEvent(new window.CustomEvent('mousemove'));
            } else if (action.type === windowActionTypes.NAVIGATE_TO) {
              history.push(action.payload);
            } else {
              store.dispatch(action);
            }
          }
        }
      }
    });
  }
};
