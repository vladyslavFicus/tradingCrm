import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

export const clientTabs = [
  {
    url: '/clients/:id/profile',
    label: 'CLIENT_PROFILE.TABS.PROFILE',
  }, {
    url: '/clients/:id/payments',
    label: 'CLIENT_PROFILE.TABS.PAYMENTS',
    permissions: new Permissions(permissions.PAYMENTS.PAYMENTS_LIST),
  }, {
    url: '/clients/:id/trading-activity',
    label: 'CLIENT_PROFILE.TABS.TRADING_ACTIVITY',
    permissions: new Permissions(permissions.TRADING_ACTIVITY.CLIENT_TRADING_ACTIVITY),
  }, {
    url: '/clients/:id/accounts',
    label: 'CLIENT_PROFILE.TABS.ACCOUNTS',
  }, {
    url: '/clients/:id/callbacks',
    label: 'CLIENT_PROFILE.TABS.CALLBACKS',
    permissions: new Permissions(permissions.CALLBACKS.LIST),
  }, {
    url: '/clients/:id/files',
    label: 'CLIENT_PROFILE.TABS.FILES',
    permissions: new Permissions(permissions.USER_PROFILE.GET_FILES),
  }, {
    url: '/clients/:id/notes',
    label: 'CLIENT_PROFILE.TABS.NOTES',
  }, {
    url: '/clients/:id/feed',
    label: 'CLIENT_PROFILE.TABS.FEED',
    permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
  }, {
    url: '/clients/:id/referrals',
    label: 'CLIENT_PROFILE.TABS.REFERRALS',
    permissions: new Permissions(permissions.USER_PROFILE.REFERRALS_HISTORY),
  },
];
