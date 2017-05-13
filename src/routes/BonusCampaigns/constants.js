import keyMirror from 'keymirror';

const actions = keyMirror({
  activate: null,
  complete: null,
});

const statuses = keyMirror({
  INACTIVE: null,
  IN_PROGRESS: null,
  ACTIVE: null,
  COMPLETED: null,
});

const statusesLabels = {
  [statuses.INACTIVE]: 'Inactive',
  [statuses.IN_PROGRESS]: 'In progress',
  [statuses.ACTIVE]: 'Active',
  [statuses.COMPLETED]: 'Completed',
};

const eventTypes = keyMirror({
  FirstDeposit: null,
  PlayerProfileCompleted: null,
});

const eventTypesLabels = {
  [eventTypes.FirstDeposit]: 'First deposit',
  [eventTypes.PlayerProfileCompleted]: 'Profile completed',
};

export {
  actions,
  statuses,
  statusesLabels,
  eventTypes,
  eventTypesLabels,
};
