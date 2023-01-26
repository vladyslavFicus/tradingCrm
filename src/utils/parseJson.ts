export default (data: string, defaultValue = {}): Object => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};
