import keyMirror from 'keymirror';

const attributeLabels = {
  pin: 'NOTES.MODAL.PIN',
  subject: 'NOTES.SUBJECT',
  content: 'NOTES.BODY',
};

const modalType = keyMirror({
  EDIT: null,
  DELETE: null,
});

export {
  attributeLabels,
  modalType,
};
