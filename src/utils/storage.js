import { parseJson } from './helpers';
const storage = localStorage;

export default Storage = {
  get(key, isObject = false) {
    let value = storage.getItem(key);

    return isObject ? parseJson(value) : value;
  },

  set(key, value) {
    let type = typeof value;
    if (type === 'object') {
      value = JSON.stringify(value);
    }

    storage.setItem(key, value);
  },
};
