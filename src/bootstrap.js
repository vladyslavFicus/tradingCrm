import { sendError, errorTypes } from './utils/errorLog';

export default () => {
  if (window) {
    window.showDebugPanel = false;
    window.reduxLocked = false;
    window.reduxLockedQueue = [];
    window.activeConnections = [];
    window.app = {
      brandId: null,
    };

    if (typeof location.origin === 'undefined') {
      window.location.origin = `${window.location.protocol}//${window.location.host}`;
    }

    window.addEventListener('error', (e) => {
      const error = {
        message: `${errorTypes.INTERNAL} error - ${e.message}`,
        errorType: errorTypes.INTERNAL,
      };

      const stack = e.error ? e.error.stack : null;

      if (stack) {
        error.stack = `\n${stack}`;
      }

      if (window.Raven) {
        window.Raven.captureException(e);
      }

      sendError(error);
    });

    window.dispatchAction = (action) => {
      if (window.isFrame) {
        window.parent.postMessage(JSON.stringify(action), window.location.origin);
      }
    };
  }
};
