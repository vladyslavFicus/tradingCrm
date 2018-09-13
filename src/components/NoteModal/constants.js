import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const attributeLabels = {
  pin: I18n.t('NOTES.MODAL.PIN'),
  note: I18n.t('NOTES.MODAL.NOTE'),
};

const modalType = keyMirror({
  EDIT: null,
  DELETE: null,
});

export {
  attributeLabels,
  modalType,
};
