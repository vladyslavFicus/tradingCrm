import permissions from 'config/permissions';

export const MAX_SELECTED_ACCOUNT_ORDERS = 1000;

export const accountProfileTabs = [
  {
    url: '/trading-engine/accounts/:id/orders',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.ORDERS',
    permissions: permissions.WE_TRADING.ORDERS_LIST,
  },
  {
    url: '/trading-engine/accounts/:id/pending-orders',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.PENDING_ORDERS',
    permissions: permissions.WE_TRADING.ORDERS_LIST,
  },
  {
    url: '/trading-engine/accounts/:id/transactions',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.TRANSACTIONS',
    permissions: permissions.WE_TRADING.TRANSACTIONS_LIST,
  },
  {
    url: '/trading-engine/accounts/:id/history',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.HISTORY',
    permissions: permissions.WE_TRADING.ORDERS_LIST,
  },
  {
    url: '/trading-engine/accounts/:id/feed',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];
