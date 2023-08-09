import { Config } from '@crm/common';

export const rbacTabs = [
  {
    url: 'permissions',
    label: 'ROLES_AND_PERMISSIONS.TABS.PERMISSIONS',
    permissions: Config.permissions.AUTH.UPDATE_ACTIONS,
  }, {
    url: 'feed',
    label: 'ROLES_AND_PERMISSIONS.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
