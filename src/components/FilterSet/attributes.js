import { I18n } from 'react-redux-i18n';
import keyMirror from 'keymirror';
import { v4 } from 'uuid';

export const filterTypes = keyMirror({
  ACTION: null,
  VIEW: null,
  DIVIDER: null,
});

export const actionTypes = keyMirror({
  UPDATE: null,
  CREATE: null,
});

export const filterOptionActionTypes = keyMirror({
  SAVE: null,
  SAVE_AS: null,
  DELETE: null,
});

export const divider = isFullWith => ({
  type: filterTypes.DIVIDER,
  dividerFullWidth: isFullWith,
  uuid: v4(),
});

export const filterActionOptions = (
  currentValues,
  selectedValue,
  saveNewFilter,
  updateExisting,
  removeFilter,
) => (!currentValues
  ? []
  : [
    divider(true),
    selectedValue
      ? {
        name: I18n.t('FILTER_SET.SELECT_OPTION.SAVE'),
        iconClassName: 'save',
        type: filterTypes.ACTION,
        uuid: v4(),
        onClick: updateExisting,
      }
      : null,
    {
      name: I18n.t('FILTER_SET.SELECT_OPTION.SAVE_AS'),
      iconClassName: 'save-as',
      type: filterTypes.ACTION,
      uuid: v4(),
      onClick: saveNewFilter,
    },
    selectedValue
      ? {
        name: I18n.t('FILTER_SET.SELECT_OPTION.DELETE'),
        iconClassName: 'delete',
        type: filterTypes.ACTION,
        uuid: v4(),
        onClick: removeFilter,
      }
      : null,
  ]
);
