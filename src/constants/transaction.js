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

const statusesLabels = {
  [statuses.Approved]: 'Approved',
  [statuses.Completed]: 'Completed',
  [statuses.Created]: 'Created',
  [statuses.Failed]: 'Failed',
  [statuses.Processed]: 'Processed',
  [statuses.Refused]: 'Refused',
  [statuses.Submitted]: 'Submitted',
};

export {
  statuses,
  statusesLabels,
};
