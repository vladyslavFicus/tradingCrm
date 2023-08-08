import { Config } from '@crm/common';

export const MAX_SELECTED_ACCOUNT_ORDERS = 1000;

export const accountProfileTabs = [
  {
    url: 'orders',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.ORDERS',
    permissions: Config.permissions.WE_TRADING.ORDERS_LIST,
  },
  {
    url: 'pending-orders',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.PENDING_ORDERS',
    permissions: Config.permissions.WE_TRADING.ORDERS_LIST,
  },
  {
    url: 'transactions',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.TRANSACTIONS',
    permissions: Config.permissions.WE_TRADING.TRANSACTIONS_LIST,
  },
  {
    url: 'history',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.HISTORY',
    permissions: Config.permissions.WE_TRADING.ORDERS_LIST,
  },
  {
    url: 'feed',
    label: 'TRADING_ENGINE.ACCOUNT_PROFILE.TABS.FEED',
    permissions: Config.permissions.AUDIT.AUDIT_LOGS,
  },
];
