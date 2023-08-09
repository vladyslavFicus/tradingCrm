import { Config } from '@crm/common';

export const favouriteStatuses = [
  { label: 'FAVOURITE', value: true },
  { label: 'NO_FAVOURITE', value: false },
];

export const pspTabs = [
  {
    url: 'list',
    label: 'SETTINGS.PSP.TABS.LIST',
    permissions: Config.permissions.PAYMENT.SEARCH_PSP,
  }, {
    url: 'feed',
    label: 'SETTINGS.PSP.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
