import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import { sendError, errorTypes } from './utils/errorLog';
import createWindowMessageService from './services/window-message';
import createInactivityService from './services/inactivity';
import createTokenService from './services/token';

if (window) {
  window.isFrame = window.parent && window.parent !== window && !!window.parent.postMessage;
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

    const stack = e.error.stack;
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

createStore({}, (store) => {
  const MOUNT_NODE = document.getElementById('root');

  let render = () => {
    const routes = require('./routes/index').default(store);

    ReactDOM.render(<AppContainer store={store} routes={routes} />, MOUNT_NODE);
  };

  if (__DEV__) {
    if (module.hot) {
      const renderApp = render;
      const renderError = (error) => {
        const RedBox = require('redbox-react').default;

        ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
      };

      render = () => {
        try {
          renderApp();
        } catch (error) {
          renderError(error);
        }
      };

      module.hot.accept('./routes/index', () =>
        setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE);
          render();
        })
      );
    }
  }

  createWindowMessageService(store);
  createInactivityService({ store });
  createTokenService({ store });

  render();
});
