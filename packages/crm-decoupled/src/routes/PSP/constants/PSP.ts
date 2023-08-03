import permissions from 'config/permissions';

export const favouriteStatuses = [
  { label: 'FAVOURITE', value: true },
  { label: 'NO_FAVOURITE', value: false },
];

export const pspTabs = [
  {
    url: 'list',
    label: 'SETTINGS.PSP.TABS.LIST',
    permissions: permissions.PAYMENT.SEARCH_PSP,
  }, {
    url: 'feed',
    label: 'SETTINGS.PSP.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
