import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

export const dealingOperatorTabs = [
  {
    url: '/trading-engine/operators/:id/profile',
    label: 'TRADING_ENGINE.OPERATOR_PROFILE.TABS.PROFILE',
    permissions: new Permissions(permissions.WE_TRADING.OPERATORS_VIEW_OPERATOR),
  },
  {
    url: '/trading-engine/operators/:id/feed',
    label: 'TRADING_ENGINE.OPERATOR_PROFILE.TABS.FEED',
    permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
  },
];
