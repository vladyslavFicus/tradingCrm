import permissions from 'config/permissions';

export const PSPTabs = [
  {
    url: '/settings/psp/list',
    label: 'SETTINGS.PSP.TABS.LIST',
    permissions: permissions.DOCUMENTS.SEARCH_DOCUMENT,
  }, {
    url: '/settings/psp/feed',
    label: 'SETTINGS.PSP.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
