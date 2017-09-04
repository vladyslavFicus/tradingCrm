import { browserHistory } from 'react-router';
import { actionTypes as windowActionTypes } from '../redux/modules/window';

export default (store) => {
  if (window) {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const action = JSON.parse(data);

          if (action && Object.values(windowActionTypes).indexOf(action.type) > -1) {
            if (action.type === windowActionTypes.SCROLL_TO_TOP) {
              window.scrollTo(0, 0);
            } else if (action.type === windowActionTypes.OPERATOR_ACTIVITY) {
              window.dispatchEvent(new CustomEvent('mousemove'));
            } else if (action.type === windowActionTypes.NAVIGATE_TO) {
              browserHistory.push(action.payload);
            } else {
              store.dispatch(action);
            }
          }
        }
      }
    });
  }
};
