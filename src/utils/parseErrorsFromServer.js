import I18n from 'i18n-js';

export default errorsFromServer => Object.keys(errorsFromServer).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(errorsFromServer[name].error),
}), {});
