import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const accessTypes = keyMirror({
  ALLOWED: null,
  FORBIDDEN: null,
});

const accessTypeLabels = {
  [accessTypes.ALLOWED]: I18n.t('CONSTANTS.COUNTRIES.TYPES.ALLOWED'),
  [accessTypes.FORBIDDEN]: I18n.t('CONSTANTS.COUNTRIES.TYPES.FORBIDDEN'),
};

const accessTypesActions = {
  [accessTypes.ALLOWED]: [
    {
      action: accessTypes.FORBIDDEN,
      label: I18n.t('CONSTANTS.COUNTRIES.TYPES_ACTION.FORBID'),
    },
  ],
  [accessTypes.FORBIDDEN]: [
    {
      action: accessTypes.ALLOWED,
      label: I18n.t('CONSTANTS.COUNTRIES.TYPES_ACTION.ALLOW'),
    },
  ],
};

const accessTypesColor = {
  [accessTypes.ALLOWED]: 'color-success',
  [accessTypes.FORBIDDEN]: 'color-danger',
};

export {
  accessTypes,
  accessTypeLabels,
  accessTypesActions,
  accessTypesColor,
};
