import permissions from 'config/permissions';

export const ipWhitelistTabs = [
  {
    url: 'list',
    label: 'IP_WHITELIST.TABS.LIST',
    permissions: permissions.IP_WHITELIST.LIST,
  }, {
    url: 'feed',
    label: 'IP_WHITELIST.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
