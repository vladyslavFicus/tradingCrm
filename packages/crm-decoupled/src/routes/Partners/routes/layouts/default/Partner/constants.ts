import { permissions } from 'config';

export const partnerTabs = [
  {
    label: 'PARTNER_PROFILE.TABS.PROFILE',
    url: 'profile',
  },
  {
    label: 'PARTNER_PROFILE.TABS.SALES_RULES',
    url: 'sales-rules',
    permissions: permissions.SALES_RULES.GET_RULES,
  },
  {
    label: 'PARTNER_PROFILE.TABS.FEED',
    url: 'feed',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
