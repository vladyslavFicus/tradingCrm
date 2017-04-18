import keyMirror from 'keymirror';
import { getErrorApiUrl } from '../config/index';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  if (__DEV__ && DISABLE_LOG) {
    console.warn(params);
    return false;
  }

  if (!__PROD__ && !__DEV__) {
    return false;
  }

  return fetch(getErrorApiUrl(__DEV__ ? 'dev' : 'stage'), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
};

export {
  sendError,
  errorTypes,
};
