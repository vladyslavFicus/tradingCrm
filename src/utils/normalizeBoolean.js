export default (value) => {
  if ([true, false, 'true', 'false'].indexOf(value) === -1) {
    throw new Error('Invalid normalize value');
  }

  return JSON.parse(value);
};
