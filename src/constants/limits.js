import keyMirror from 'keymirror';

const statuses = keyMirror({
  PENDING: null,
  IN_PROGRESS: null,
  CANCELED: null,
  COOLOFF: null,
});

const statusesLabels = {
  [statuses.PENDING]: 'Pending',
  [statuses.IN_PROGRESS]: 'Active',
  [statuses.CANCELED]: 'Canceled',
  [statuses.COOLOFF]: 'Cooloff',
};

const types = {
  SESSION_DURATION: 'session_duration',
  WAGER: 'wager',
  LOSS: 'loss',
};

const amountTypes = {
  MONEY: 'money',
  TIME: 'time',
};

const typesLabels = {
  [types.SESSION_DURATION]: 'Session limit',
  [types.WAGER]: 'Wager limit',
  [types.LOSS]: 'Loss limit',
};

const statusesColor = {
  [statuses.IN_PROGRESS]: 'color-success',
  [statuses.CANCELED]: 'color-danger',
  [statuses.COOLOFF]: 'color-info',
  [statuses.PENDING]: 'color-secondary',
};

const timeUnits = keyMirror({
  MINUTES: null,
  HOURS: null,
  DAYS: null,
});

export {
  statuses,
  types,
  typesLabels,
  statusesColor,
  statusesLabels,
  timeUnits,
  amountTypes,
};
