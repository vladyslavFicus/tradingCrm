import parseJson from './parseJson';

const storage = window.localStorage;

export default {
  get(key, isObject = false) {
    const value = storage.getItem(key);

    return isObject ? parseJson(storage.getItem(key)) : value;
  },

  set(key, value) {
    storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  },

  remove(key) {
    storage.removeItem(key);
  },
};
