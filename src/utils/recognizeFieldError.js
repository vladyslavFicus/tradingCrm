import I18n from 'i18n-js';

export default function (inputError, map) {
  const formField = map[inputError.split('.').slice(-1).pop()];

  return formField ? { [formField]: I18n.t(inputError) } : false;
}
