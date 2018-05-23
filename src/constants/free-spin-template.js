import keyMirror from 'keymirror';

const statuses = keyMirror({
  PENDING: null,
  CREATED: null,
  FAILED: null,
  DISABLED: null,
  INACTIVE: null,
});

export {
  statuses,
};
