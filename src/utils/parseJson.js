export default (data, defaultValue = {}) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};
