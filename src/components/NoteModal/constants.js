import keyMirror from 'keymirror';

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  note: 'NOTES.MODAL.NOTE',
};

const modalType = keyMirror({
  EDIT: null,
  DELETE: null,
});

export {
  attributeLabels,
  modalType,
};
