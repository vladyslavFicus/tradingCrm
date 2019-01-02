import { I18n } from 'react-redux-i18n';

export default errorsFromServer => Object.keys(errorsFromServer).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(errorsFromServer[name].error),
}), {});
