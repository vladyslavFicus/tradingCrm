import { actionTypes as windowActionTypes } from '../redux/modules/window';

export default (store) => {
  if (window) {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const action = JSON.parse(data);

          if (action && Object.values(windowActionTypes).indexOf(action.type) > -1) {
            store.dispatch(action);
          }
        }
      }
    });
  }
};
