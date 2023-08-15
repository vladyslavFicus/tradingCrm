// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Config } from '@crm/common';
import Root from './Root';

import './styles/index.scss';

// Sentry initialization
if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_VERSION) {
  Sentry.init({
    dsn: 'https://8ab27e9e8bec40e09f8e1af749b24c09@sentry.cydev.io/3',
    integrations: [new BrowserTracing()],
    release: process.env.REACT_APP_VERSION,
    tracesSampleRate: 1.0,
  });
}

// Set brand for application instance
Config.setBackofficeBrand(
  window.localStorage.getItem('crmBrand') // To override by our team to make some tests
  || window.__CRM_BRAND__ // Get real CRM brand from domain configuration
  || process.env.REACT_APP_DEFAULT_BACKOFFICE_BRAND, // Get fallback from development config
);

ReactDOM.render(<Root />, document.getElementById('root'));
