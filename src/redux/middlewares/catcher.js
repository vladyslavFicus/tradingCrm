import { isValidRSAA } from 'redux-api-middleware';

export default () => next => (action) => {
  if (window.reduxLocked) {
    if (isValidRSAA(action)) {
      return new Promise((resolve) => {
        window.reduxLockedQueue.push({ action, next, resolve });
      });
    }

    window.reduxLockedQueue.push({ action, next });
  } else {
    const result = next(action);
    if (isValidRSAA(action)) {
      window.activeConnections.push(result);

      result.then(() => {
        const index = window.activeConnections.indexOf(result);

        if (index > -1) {
          window.activeConnections.splice(index, 1);
        }
      });
    }

    return result;
  }
};
