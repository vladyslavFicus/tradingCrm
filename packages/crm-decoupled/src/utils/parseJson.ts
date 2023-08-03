export default (json: string) => {
  try {
    return JSON.parse(json) || {};
  } catch (e) {
    return {};
  }
};
