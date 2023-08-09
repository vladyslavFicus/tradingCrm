import { Config } from '@crm/common';

export const dealingOperatorTabs = [
  {
    url: 'profile',
    label: 'TRADING_ENGINE.OPERATOR_PROFILE.TABS.PROFILE',
    permissions: Config.permissions.WE_TRADING.OPERATORS_VIEW_OPERATOR,
  },
  {
    url: 'feed',
    label: 'TRADING_ENGINE.OPERATOR_PROFILE.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
