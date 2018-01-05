import keyMirror from 'keymirror';
import config, { getErrorApiUrl, getBrand, getVersion } from '../config';
import Storage from '../utils/storage';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  if (__DEV__) {
    console.warn(params);

    return false;
  }

  if (__TEST__) {
    return false;
  }

  let body = {
    ...params,
    brand: window.app.brandId,
    version: getVersion(),
  };

  const settings = Storage.get(`${config.middlewares.persist.keyPrefix}settings`, true);
  if (settings) {
    body = { ...body, ...settings.errorParams };
  }

  return fetch(getErrorApiUrl(), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export {
  sendError,
  errorTypes,
};
