import keyMirror from 'keymirror';

const kycNoteTypes = keyMirror({
  kycRequest: null,
  verify: null,
  verifyAll: null,
  refuse: null,
});

export {
  kycNoteTypes,
};
