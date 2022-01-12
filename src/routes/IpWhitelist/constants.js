import permissions from 'config/permissions';
import Permissions from 'utils/permissions';

export const ipWhitelistTabs = [
  {
    url: '/ip-whitelist/list',
    label: 'IP_WHITELIST.TABS.LIST',
    permissions: new Permissions(permissions.IP_WHITELIST.LIST),
  }, {
    url: '/ip-whitelist/feed',
    label: 'IP_WHITELIST.TABS.FEED',
    permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
  },
];
