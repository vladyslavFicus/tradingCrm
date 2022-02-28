import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

export const accountProfileTabs = [
  {
    url: '/trading-engine/accounts/:id/orders',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.ORDERS',
    permissions: new Permissions(permissions.WE_TRADING.ORDERS_LIST),
  },
  {
    url: '/trading-engine/accounts/:id/pending-orders',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.PENDING_ORDERS',
    permissions: new Permissions(permissions.WE_TRADING.ORDERS_LIST),
  },
  {
    url: '/trading-engine/accounts/:id/transactions',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.TRANSACTIONS',
    permissions: new Permissions(permissions.WE_TRADING.TRANSACTIONS_LIST),
  },
  {
    url: '/trading-engine/accounts/:id/history',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.HISTORY',
    permissions: new Permissions(permissions.WE_TRADING.ORDERS_LIST),
  },
  {
    url: '/trading-engine/accounts/:id/feed',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.FEED',
    permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
  },
];
