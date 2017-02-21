import keyMirror from 'keymirror';

const LIMIT_STATUSES = keyMirror({
  ACTIVE: null,
  PENDING: null,
  IN_PROGRESS: null,
  CANCELLED: null,
});

const LIMIT_TYPES = {
  SESSION_DURATION: 'session_duration',
  WAGER: 'wager',
  LOSS: 'loss',
};
const LIMIT_TYPES_LABELS = {
  [LIMIT_TYPES.SESSION_DURATION]: 'Session duration',
  [LIMIT_TYPES.WAGER]: 'Wager',
  [LIMIT_TYPES.LOSS]: 'Loss',
};

const TIME_UNITS = keyMirror({
  MINUTES: null,
  HOURS: null,
  DAYS: null,
});

export {
  TIME_UNITS,
  LIMIT_STATUSES,
  LIMIT_TYPES,
  LIMIT_TYPES_LABELS,
};
