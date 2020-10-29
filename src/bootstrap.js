import * as Sentry from '@sentry/browser';
import Cookies from 'js-cookie';
import { getVersion, setBackofficeBrand } from 'config';

export default () => {
  // Sentry initialization
  if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
      dsn: 'https://a3cff5493c3a4d0dbead367f8d01e700@sentry.io/1358381',
      release: getVersion(),
    });
  }

  // Set brand for application instance
  setBackofficeBrand(Cookies.get('brand') || process.env.REACT_APP_DEFAULT_BACKOFFICE_BRAND);
};
