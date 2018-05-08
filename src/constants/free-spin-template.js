import keyMirror from 'keymirror';

const statuses = keyMirror({
  PENDING: null,
  CREATED: null,
  FAILED: null,
  DISABLED: null,
});

export {
  statuses,
};
