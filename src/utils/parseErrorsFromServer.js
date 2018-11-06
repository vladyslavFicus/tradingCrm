export default errorsFromServer => Object.keys(errorsFromServer).reduce((res, name) => ({
  ...res,
  [name]: errorsFromServer[name].error,
}), {});
