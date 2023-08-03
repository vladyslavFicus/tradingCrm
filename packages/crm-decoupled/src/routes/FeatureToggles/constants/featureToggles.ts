import permissions from 'config/permissions';

export const featureTabs = [
  {
    url: 'features',
    label: 'FEATURE_TOGGLES.TABS.FEATURES',
    permissions: permissions.BRAND_CONFIG.UPDATE_BRAND_CONFIG,
  }, {
    url: 'feed',
    label: 'FEATURE_TOGGLES.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
