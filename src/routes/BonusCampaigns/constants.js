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
  FIRST_DEPOSIT: null,
  PROFILE_COMPLETED: null,
});

const eventTypesLabels = {
  [eventTypes.FIRST_DEPOSIT]: 'First deposit',
  [eventTypes.PROFILE_COMPLETED]: 'Profile completed',
};

export {
  actions,
  statuses,
  statusesLabels,
  eventTypes,
  eventTypesLabels,
};
