import { I18n } from 'react-redux-i18n';

export default function (inputError, map) {
  const formField = map[inputError.split('.').slice(-1).pop()];

  return formField ? { [formField]: I18n.t(inputError) } : false;
}
