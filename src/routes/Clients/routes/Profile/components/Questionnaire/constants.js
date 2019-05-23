import keyMirror from 'keymirror';

const statuses = keyMirror({
  PASSED: null,
  APPROVED: null,
  REJECTED: null,
});

const statusColors = {
  [statuses.PASSED]: 'color-info',
  [statuses.APPROVED]: 'color-success',
  [statuses.REJECTED]: 'color-danger',
};

export { statuses, statusColors };
