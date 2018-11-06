export default function (data, defaultValue = {}) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
}
