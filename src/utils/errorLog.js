import keyMirror from 'keymirror';
import { getErrorApiUrl } from '../config/index';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  if (__PROD__) {
    fetch(getErrorApiUrl(), {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  }
  if (__DEV__) {
    console.warn(params);
  }
};

export {
  sendError,
  errorTypes,
};
