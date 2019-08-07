import parseJSON from './parseJson';
import { getApiVersion } from '../config';

export default (url, options) => {
  const xhr = new window.XMLHttpRequest();
  if (typeof options.onprogress === 'function') {
    xhr.upload.onprogress = options.onprogress;
  }

  return {
    send: () => new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) {
          const error = new Error(`${xhr.status} - ${xhr.statusText}`);
          error.code = xhr.status;
          error.xhr = xhr;

          reject(error);
        } else {
          resolve(parseJSON(xhr.responseText));
        }
      };

      xhr.open(options.method, url, true);
      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }
      xhr.setRequestHeader('X-CLIENT-Version', getApiVersion());
      xhr.send(options.body || null);
    }),
    abort: () => xhr.abort(),
  };
};
