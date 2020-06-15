import keyMirror from 'keymirror';

const statuses = keyMirror({
  NEW: null,
  NEVER_ANSWER: null,
  VOICE_MAIL: null,
  CONVERTED: null,
});

export {
  statuses,
};
