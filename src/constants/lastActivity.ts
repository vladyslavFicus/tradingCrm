enum lastActivityStatuses {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export const lastActivityStatusesLabels: Record<lastActivityStatuses, string> = {
  [lastActivityStatuses.ONLINE]: 'CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.STATUS.ONLINE',
  [lastActivityStatuses.OFFLINE]: 'CLIENT_PROFILE.CLIENT.LAST_ACTIVITY.STATUS.OFFLINE',
};
