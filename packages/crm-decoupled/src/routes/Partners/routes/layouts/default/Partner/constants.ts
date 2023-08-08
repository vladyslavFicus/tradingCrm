import { Config } from '@crm/common';

export const partnerTabs = [
  {
    label: 'PARTNER_PROFILE.TABS.PROFILE',
    url: 'profile',
  },
  {
    label: 'PARTNER_PROFILE.TABS.SALES_RULES',
    url: 'sales-rules',
    permissions: Config.permissions.SALES_RULES.GET_RULES,
  },
  {
    label: 'PARTNER_PROFILE.TABS.FEED',
    url: 'feed',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
