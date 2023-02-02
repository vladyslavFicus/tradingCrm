import permissions from 'config/permissions';

export const rbacTabs = [
  {
    url: '/roles-and-permissions/permissions',
    label: 'ROLES_AND_PERMISSIONS.TABS.PERMISSIONS',
    permissions: permissions.AUTH.UPDATE_ACTIONS,
  }, {
    url: '/roles-and-permissions/feed',
    label: 'ROLES_AND_PERMISSIONS.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
