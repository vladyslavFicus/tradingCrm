import { Config } from '@crm/common';

export const documentsTabs = [
  {
    url: 'list',
    label: 'DOCUMENTS.TABS.LIST',
    permissions: Config.permissions.DOCUMENTS.SEARCH_DOCUMENT,
  }, {
    url: 'feed',
    label: 'DOCUMENTS.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
