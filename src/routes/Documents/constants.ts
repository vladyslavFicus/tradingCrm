import permissions from 'config/permissions';

export const DocumentsTabs = [
  {
    url: '/documents/list',
    label: 'DOCUMENTS.TABS.LIST',
    permissions: permissions.DOCUMENTS.SEARCH_DOCUMENT,
  }, {
    url: '/documents/feed',
    label: 'DOCUMENTS.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
