import { CALL_API, isValidRSAA } from 'redux-api-middleware';
import { v4 } from 'uuid';
import { actionTypes as authActionTypes } from '../modules/auth';
import { actionTypes as userPanelsActionTypes } from '../modules/user-panels';

export default ({ getState }) => next => (action) => {
  if (!action) {
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
    } else if (action.type === userPanelsActionTypes.ADD) {
      window.activeConnections.push(new Promise((resolve) => {
        const uuid = v4();
        console.warn(`unresolved: ${uuid}`);
        setTimeout(() => {
          console.warn(`resolved: ${uuid}`);
          resolve();
        }, 10000);
      }));
    }

    return result;
  }
};
