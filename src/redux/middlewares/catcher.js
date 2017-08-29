import { isValidRSAA } from 'redux-api-middleware';

export default () => next => (action) => {
  console.log(`window.reduxLocked = ${window.reduxLocked}`);
  if (window.reduxLocked) {
    if (isValidRSAA(action)) {
      return new Promise((resolve) => {
        window.reduxLockedQueue.push({ action, next, resolve });
      });
    }

    window.reduxLockedQueue.push({ action, next });
  } else {
    return next(action);
  }
};
