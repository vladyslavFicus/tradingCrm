import permissions from 'config/permissions';

export const documentsTabs = [
  {
    url: 'list',
    label: 'DOCUMENTS.TABS.LIST',
    permissions: permissions.DOCUMENTS.SEARCH_DOCUMENT,
  }, {
    url: 'feed',
    label: 'DOCUMENTS.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
