import sentry from './utils/sentry';

export default () => {
  if (window) {
    window.showDebugPanel = false;
    window.reduxLocked = false;
    window.reduxLockedQueue = [];
    window.activeConnections = [];
    window.app = {
      brandId: null,
    };

    if (typeof window.location.origin === 'undefined') {
      window.location.origin = `${window.location.protocol}//${window.location.host}`;
    }

    window.addEventListener('error', sentry.captureException);

    window.dispatchAction = (action) => {
      if (window.isFrame) {
        window.parent.postMessage(JSON.stringify(action), window.location.origin);
      }
    };
  }
};
