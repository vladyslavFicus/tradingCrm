import keyMirror from 'keymirror';

const statuses = keyMirror({
  Approved: null,
  Completed: null,
  Created: null,
  Failed: null,
  Processed: null,
  Refused: null,
  Submitted: null,
});

const initiators = keyMirror({
  PLAYER: null,
  OPERATOR: null,
});

const statusesLabels = {
  [statuses.Approved]: 'Approved',
  [statuses.Completed]: 'Completed',
  [statuses.Created]: 'Created',
  [statuses.Failed]: 'Failed',
  [statuses.Processed]: 'Processed',
  [statuses.Refused]: 'Refused',
  [statuses.Submitted]: 'Submitted',
};

const initiatorsLabels = {
  [initiators.PLAYER]: 'Player',
  [initiators.OPERATOR]: 'Operator',
};

const statusesColor = {
  [statuses.Completed]: 'color-success',
  [statuses.Failed]: 'color-danger',
  [statuses.Refused]: 'color-warning',
  [statuses.Created]: 'color-default',
  [statuses.Processed]: 'color-secondary',
  [statuses.Approved]: 'color-info',
  [statuses.Submitted]: 'color-primary',
};

export {
  statuses,
  initiators,
  statusesLabels,
  initiatorsLabels,
  statusesColor,
};
