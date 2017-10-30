export default (errors, node, prefix = true) => {
  const subFieldsPattern = new RegExp(`^${node}`, 'i');

  const subFieldsErrors = Object.keys(errors)
    .filter(key => subFieldsPattern.test(key))
    .reduce((res, key) => {
      let errorKey = key;
      if (!prefix) {
        errorKey = key.split('.').slice(1).join('.');
      }
      res[errorKey] = errors[key];
      return res;
    }, {});

  return subFieldsErrors;
};
