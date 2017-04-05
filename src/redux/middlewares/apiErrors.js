import { getErrorApiUrl } from '../../config/index';

const regExp = new RegExp('-failure$');

export default () => next => (action) => {
  if (action.error && regExp.test(action.type)) {
    const errorApiUrl = getErrorApiUrl();
    fetch(errorApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: action.type,
        code: action.payload.status,
        error: action.payload.response.error,
      }),
    });
  }

  return next(action);
};
