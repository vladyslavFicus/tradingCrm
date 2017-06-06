import keyMirror from 'keymirror';
import { getErrorApiUrl, getBrand } from '../config';

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

  return fetch(getErrorApiUrl(), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brand: getBrand(),
      ...params,
    }),
  });
};

export {
  sendError,
  errorTypes,
};
