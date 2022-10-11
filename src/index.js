import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { getVersion, setBackofficeBrand } from 'config';
import Root from './Root';

import './styles/index.scss';

// Sentry initialization
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://a3cff5493c3a4d0dbead367f8d01e700@sentry.io/1358381',
    release: getVersion(),
  });
}

// Set brand for application instance
setBackofficeBrand(
  window.localStorage.getItem('crmBrand') // To override by our team to make some tests
  || window.__CRM_BRAND__ // Get real CRM brand from domain configuration
  || process.env.REACT_APP_DEFAULT_BACKOFFICE_BRAND, // Get fallback from development config
);

ReactDOM.render(<Root />, document.getElementById('root'));
