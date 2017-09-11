import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import { actionTypes as authActionTypes } from '../modules/auth';

export default () => next => (action) => {
  if (window.reduxLocked) {
    if (isValidRSAA(action)) {
      if (action[CALL_API].types.indexOf(authActionTypes.REFRESH_TOKEN.SUCCESS) > -1) {
        return next(action);
      }

      return new Promise((resolve) => {
        window.reduxLockedQueue.push({ action, next, resolve });
      });
    }

    window.reduxLockedQueue.push({ action, next });
  } else {
    const result = next(action);

    if (isValidRSAA(action)) {
      if (result) {
        window.activeConnections.push(result);

        result.then(() => {
          const index = window.activeConnections.indexOf(result);

          if (index > -1) {
            window.activeConnections.splice(index, 1);
          }
        });
      }
    }

    return result;
  }
};
