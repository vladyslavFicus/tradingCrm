import keyMirror from 'keymirror';
import { getErrorApiUrl } from '../config/index';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  fetch(getErrorApiUrl(), {
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
