import keyMirror from 'keymirror';

const statuses = keyMirror({
  INACTIVE: null,
  IN_PROGRESS: null,
  WAGERING_COMPLETE: null,
  CONSUMED: null,
  CANCELLED: null,
  EXPIRED: null,
});

const statusesLabels = {
  [statuses.INACTIVE]: 'Inactive',
  [statuses.IN_PROGRESS]: 'In progress',
  [statuses.WAGERING_COMPLETE]: 'Wagering complete',
  [statuses.CONSUMED]: 'Consumed',
  [statuses.CANCELLED]: 'Cancelled',
  [statuses.EXPIRED]: 'Expired',
};

export {
  statuses,
  statusesLabels,
};
