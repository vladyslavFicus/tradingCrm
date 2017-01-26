import keyMirror from 'keymirror';

const states = keyMirror({
  IN_REVIEW: null,
  APPROVED: null,
  REJECTED: null,
});
const statesLabels = {
  [states.IN_REVIEW]: 'In review',
  [states.REJECTED]: 'Rejected',
  [states.APPROVED]: 'Approved',
};

export {
  states,
  statesLabels,
};
