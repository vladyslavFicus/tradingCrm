import keyMirror from 'keymirror';
import { getErrorApiUrl, getBrand, getVersion } from '../config';
import Storage from '../utils/storage';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  if (!__DEV__) {
    console.warn(params);

    return false;
  }

  if (__TEST__) {
    return false;
  }

  const body = {
    ...params,
    brand: getBrand(),
    version: getVersion(),
  };

  const testSpec = Storage.get('test.spec');
  if (testSpec) {
    body.testSpec = testSpec;
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
