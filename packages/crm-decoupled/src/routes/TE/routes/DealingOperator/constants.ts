import { permissions } from 'config';

export const dealingOperatorTabs = [
  {
    url: 'profile',
    label: 'TRADING_ENGINE.OPERATOR_PROFILE.TABS.PROFILE',
    permissions: permissions.WE_TRADING.OPERATORS_VIEW_OPERATOR,
  },
  {
    url: 'feed',
    label: 'TRADING_ENGINE.OPERATOR_PROFILE.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
