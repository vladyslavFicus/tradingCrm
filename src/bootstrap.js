import * as Sentry from '@sentry/browser';
import Cookies from 'js-cookie';
import { getEnvironment, getVersion, setBackofficeBrand } from 'config';

export default () => {
  // Sentry initialization
  if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
      dsn: 'https://a3cff5493c3a4d0dbead367f8d01e700@sentry.io/1358381',
      environment: getEnvironment(),
      release: getVersion(),
    });
  }

  // Set brand for application instance
  setBackofficeBrand(Cookies.get('brand') || window.nas.defaultBackofficeBrand);

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

    window.dispatchAction = (action) => {
      if (window.isFrame) {
        window.parent.postMessage(JSON.stringify(action), window.location.origin);
      }
    };
  }
};
