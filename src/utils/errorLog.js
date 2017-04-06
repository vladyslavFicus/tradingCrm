import keyMirror from 'keymirror';
import { getErrorApiUrl } from '../config/index';

const errorTypes = keyMirror({
  INTERNAL: null,
  API: null,
});

const sendError = (params) => {
  const errorApiUrl = getErrorApiUrl();
  fetch(errorApiUrl, {
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
