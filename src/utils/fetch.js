import { getApiVersion } from '../config';

const customFetch = async (url, options) => {
  const nextOptions = { ...options };

  if (nextOptions) {
    if (!nextOptions.headers) {
      nextOptions.headers = {};
    }

    nextOptions.headers['X-CLIENT-Version'] = getApiVersion();
  }

  const response = await fetch(url, nextOptions);

  if (response.status === 426) {
    window.app.onApiVersionChanged();
    throw new Error('Invalid app version');
  }

  return response;
};

export default customFetch;
