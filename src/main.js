import 'styles/vendor.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import bootstrap from './bootstrap';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import createWindowMessageService from './services/window-message';

bootstrap();

createStore({}, (store) => {
  const MOUNT_NODE = document.getElementById('root');

  let render = () => {
    ReactDOM.render(<AppContainer store={store} />, MOUNT_NODE);
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

      module.hot.accept(() =>
        setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE);
          render();
        }));
    }
  }

  createWindowMessageService(store);

  render();
});
