import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import { sendError, errorTypes } from './utils/errorLog';
import { actionTypes as windowActionTypes } from './redux/modules/window';

moment.updateLocale('en', {
  longDateFormat: {
    L: 'YYYY/MM/DD',
  },
});

const initialState = window.___INITIAL_STATE__;
createStore(initialState, (store) => {
  const MOUNT_NODE = document.getElementById('root');

  let render = () => {
    const routes = require('./routes/index').default(store);

    ReactDOM.render(
      <AppContainer
        store={store}
        routes={routes}
      />,
      MOUNT_NODE
    );
  };

  if (__DEV__) {
    if (module.hot) {
      // Development render functions
      const renderApp = render;
      const renderError = (error) => {
        const RedBox = require('redbox-react').default;

        ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
      };

      // Wrap render in try/catch
      render = () => {
        try {
          renderApp();
        } catch (error) {
          renderError(error);
        }
      };

      // Setup hot module replacement
      module.hot.accept('./routes/index', () =>
        setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE);
          render();
        })
      );
    }
  }

  if (window && window.parent === window) {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const message = JSON.parse(data);

          if (message.action && Object.values(windowActionTypes).indexOf(message.action.type) > -1) {
            store.dispatch(message.action);
          }
        }
      }
    });
  }

  render();
});

if (window) {
  if (typeof location.origin === 'undefined') {
    window.location.origin = window.location.protocol + '//' + window.location.host;
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

    sendError(error);
  });
}
