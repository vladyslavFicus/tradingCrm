import permissions from 'config/permissions';

export const rbacTabs = [
  {
    url: 'permissions',
    label: 'ROLES_AND_PERMISSIONS.TABS.PERMISSIONS',
    permissions: permissions.AUTH.UPDATE_ACTIONS,
  }, {
    url: 'feed',
    label: 'ROLES_AND_PERMISSIONS.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
