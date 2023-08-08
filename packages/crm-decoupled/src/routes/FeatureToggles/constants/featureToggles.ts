import { Config } from '@crm/common';

export const featureTabs = [
  {
    url: 'features',
    label: 'FEATURE_TOGGLES.TABS.FEATURES',
    permissions: Config.permissions.BRAND_CONFIG.UPDATE_BRAND_CONFIG,
  }, {
    url: 'feed',
    label: 'FEATURE_TOGGLES.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
