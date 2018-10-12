import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const statuses = keyMirror({
  PENDING: null,
  IN_PROGRESS: null,
  ACTIVE: null,
  CANCELED: null,
  COOLOFF: null,
});

const statusesLabels = {
  [statuses.PENDING]: 'Pending',
  [statuses.IN_PROGRESS]: 'Active',
  [statuses.ACTIVE]: 'Active',
  [statuses.CANCELED]: 'Canceled',
  [statuses.COOLOFF]: 'Cooloff',
};

const types = {
  SESSION_DURATION: 'session_duration',
  WAGER: 'wager',
  LOSS: 'loss',
  DEPOSIT: 'deposit',
  REGULATION: 'regulation',
};

const amountTypes = {
  MONEY: 'money',
  TIME: 'time',
};

const valueTypes = keyMirror({
  USED: null,
  LEFT: null,
});

const valueTypeLabels = {
  [valueTypes.USED]: I18n.t('PLAYER_PROFILE.LIMITS.VALUE_TYPES.USED'),
  [valueTypes.LEFT]: I18n.t('PLAYER_PROFILE.LIMITS.VALUE_TYPES.LEFT'),
};

const typesLabels = {
  [types.SESSION_DURATION]: 'Session limit',
  [types.WAGER]: 'Wager limit',
  [types.LOSS]: 'Loss limit',
  [types.DEPOSIT]: 'Deposit limit',
  [types.REGULATION]: 'Regulation limit',
};

const statusesColor = {
  [statuses.IN_PROGRESS]: 'color-success',
  [statuses.ACTIVE]: 'color-success',
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
  valueTypeLabels,
};
