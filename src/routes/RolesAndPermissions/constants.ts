import permissions from 'config/permissions';
import Permissions from 'utils/permissions';

export const rbacTabs = [
  {
    url: '/roles-and-permissions/permissions',
    label: 'ROLES_AND_PERMISSIONS.TABS.PERMISSIONS',
    permissions: new Permissions(permissions.AUTH.UPDATE_ACTIONS),
  }, {
    url: '/roles-and-permissions/feed',
    label: 'ROLES_AND_PERMISSIONS.TABS.FEED',
    permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
  },
];
