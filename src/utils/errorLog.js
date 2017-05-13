import keyMirror from 'keymirror';
import { getErrorApiUrl, getBrand } from '../config/index';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  if (DISABLE_LOG) {
    console.warn(params);
    return false;
  }

  if (__TEST__) {
    return false;
  }

  return fetch(getErrorApiUrl(), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      _brand: getBrand(),
    }),
  });
};

export {
  sendError,
  errorTypes,
};
