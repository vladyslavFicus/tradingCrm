import { browserHistory } from 'react-router';
import { actionTypes as windowActionTypes } from '../redux/modules/window';

export default (store) => {
  if (window) {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const action = JSON.parse(data);

          if (action && Object.values(windowActionTypes).indexOf(action.type) > -1) {
            // TODO: move to middleware
            if (action.type === windowActionTypes.NAVIGATE_TO) {
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
