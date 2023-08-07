import { permissions } from 'config';

export const clientTabs = [
  {
    url: 'profile',
    label: 'CLIENT_PROFILE.TABS.PROFILE',
  }, {
    url: 'payments',
    label: 'CLIENT_PROFILE.TABS.PAYMENTS',
    permissions: permissions.PAYMENTS.PAYMENTS_LIST,
  }, {
    url: 'trading-activity',
    label: 'CLIENT_PROFILE.TABS.TRADING_ACTIVITY',
    permissions: permissions.TRADING_ACTIVITY.CLIENT_TRADING_ACTIVITY,
  }, {
    url: 'accounts',
    label: 'CLIENT_PROFILE.TABS.ACCOUNTS',
  }, {
    url: 'callbacks',
    label: 'CLIENT_PROFILE.TABS.CALLBACKS',
    permissions: permissions.USER_PROFILE.CALLBACKS_LIST,
  }, {
    url: 'files',
    label: 'CLIENT_PROFILE.TABS.FILES',
    permissions: permissions.USER_PROFILE.GET_FILES,
  }, {
    url: 'call-history',
    label: 'CLIENT_PROFILE.TABS.CALL_HISTORY',
    permissions: permissions.CALL_HISTORY.LIST,
  }, {
    url: 'notes',
    label: 'CLIENT_PROFILE.TABS.NOTES',
  }, {
    url: 'feed',
    label: 'CLIENT_PROFILE.TABS.FEED',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  }, {
    url: 'referrals',
    label: 'CLIENT_PROFILE.TABS.REFERRALS',
    permissions: permissions.USER_PROFILE.REFERRALS_HISTORY,
  },
];
