import keyMirror from 'keymirror';

const lastActivityStatuses = keyMirror({
  ONLINE: null,
  OFFLINE: null,
});

const lastActivityStatusesLabels = {
  [lastActivityStatuses.ONLINE]: 'PROFILE.LAST_ACTIVITY.STATUS.ONLINE',
  [lastActivityStatuses.OFFLINE]: 'PROFILE.LAST_ACTIVITY.STATUS.OFFLINE',
};

const lastActivityStatusesColors = {
  [lastActivityStatuses.ONLINE]: 'text-success',
  [lastActivityStatuses.OFFLINE]: 'text-muted',
};

export {
  lastActivityStatusesLabels,
  lastActivityStatusesColors,
};
