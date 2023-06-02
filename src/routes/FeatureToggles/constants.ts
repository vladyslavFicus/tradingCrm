import permissions from 'config/permissions';

export const featureTabs = [
  {
    url: '/feature-toggles/features',
    label: 'FEATURE_TOGGLES.TABS.FEATURES',
    permissions: permissions.BRAND_CONFIG.UPDATE_BRAND_CONFIG,
  }, {
    url: '/feature-toggles/feed',
    label: 'FEATURE_TOGGLES.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
