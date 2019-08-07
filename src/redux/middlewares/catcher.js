import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import { actionTypes as authActionTypes } from '../modules/auth';

export default ({ getState }) => next => (action) => {
  if (!action) {
    return next(action);
  }

  if (action.type === authActionTypes.LOGOUT.SUCCESS) {
    window.reduxLocked = false;
    window.reduxLockedQueue = [];

    return next(action);
  }

  if (window.reduxLocked) {
    if (isValidRSAA(action)) {
      const shouldPropagate = action[CALL_API].types.indexOf(authActionTypes.REFRESH_TOKEN.SUCCESS) > -1
        && !getState().auth.refreshingToken;

      if (shouldPropagate) {
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

  return null;
};
