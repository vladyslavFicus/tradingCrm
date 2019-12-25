import 'styles/old/vendor.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { getBackofficeBrand } from 'config';
import bootstrap from './bootstrap';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';

bootstrap();

createStore({}, (store) => {
  const MOUNT_NODE = document.getElementById('root');

  const render = () => {
    // Check if backoffice brand wasn't found
    if (!getBackofficeBrand()) {
      ReactDOM.render(
        'Brand not found in cookie: brand=BRAND_NAME or in process.env.NAS_BRAND or in local brand configuration',
        MOUNT_NODE,
      );
    } else {
      ReactDOM.render(<AppContainer store={store} />, MOUNT_NODE);
    }
  };

  render();
});
