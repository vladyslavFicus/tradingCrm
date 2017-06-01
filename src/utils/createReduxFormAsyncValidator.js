export default validatorFn => (values, dispatch, props, blurredField) => {
  const oldErrors = props.asyncErrors || {};

  return new Promise((resolve, reject) => {
    if (blurredField) {
      validatorFn(blurredField, values[blurredField])
        .then(() => resolve(oldErrors), error => reject({
          ...oldErrors,
          ...error,
        }));
    } else {
      resolve(oldErrors);
    }
  });
};
