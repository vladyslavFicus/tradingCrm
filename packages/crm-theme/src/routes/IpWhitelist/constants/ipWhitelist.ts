import { Config } from '@crm/common';

export const ipWhitelistTabs = [
  {
    url: 'list',
    label: 'IP_WHITELIST.TABS.LIST',
    permissions: Config.permissions.IP_WHITELIST.LIST,
  }, {
    url: 'feed',
    label: 'IP_WHITELIST.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
