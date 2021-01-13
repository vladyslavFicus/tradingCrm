import keyMirror from 'keymirror';

// # File must be removed after GridStatus component refactoring

const lastActivityStatuses = keyMirror({
  ONLINE: null,
  OFFLINE: null,
});

const lastActivityStatusesLabels = {
  [lastActivityStatuses.ONLINE]: 'CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.STATUS.ONLINE',
  [lastActivityStatuses.OFFLINE]: 'CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.STATUS.OFFLINE',
};

const lastActivityStatusesColors = {
  [lastActivityStatuses.ONLINE]: 'text-success',
  [lastActivityStatuses.OFFLINE]: 'text-muted',
};

export {
  lastActivityStatusesLabels,
  lastActivityStatusesColors,
};
