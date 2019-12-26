import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { getActiveBrandConfig } from 'config';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';

export const userProfileTabs = [
  {
    label: 'CLIENT_PROFILE.TABS.PROFILE',
    url: '/clients/:id/profile',
  }, {
    url: '/clients/:id/payments',
    label: 'CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS',
    permissions: new Permissions(permissions.PAYMENTS.PLAYER_PAYMENTS_LIST),
  }, {
    url: '/clients/:id/trading-activity',
    label: 'CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY',
    permissions: new Permissions(permissions.TRADING_ACTIVITY.CLIENT_TRADING_ACTIVITY),
  }, {
    label: 'CLIENT_PROFILE.TABS.ACCOUNTS',
    url: '/clients/:id/accounts',
  }, {
    label: 'CLIENT_PROFILE.TABS.CALLBACKS',
    url: '/clients/:id/callbacks',
  }, {
    label: 'CLIENT_PROFILE.TABS.FILES',
    url: '/clients/:id/files',
  }, {
    label: 'CLIENT_PROFILE.TABS.NOTES',
    url: '/clients/:id/notes',
  }, {
    label: 'CLIENT_PROFILE.TABS.FEED',
    url: '/clients/:id/feed',
  },
];

// # Add risk tab if current brand is regulated
if (getActiveBrandConfig().regulation.isActive) {
  userProfileTabs.push({
    label: 'CLIENT_PROFILE.TABS.RISK_PROFILE',
    url: '/clients/:id/risk',
  });
}

export const moveField = type => ({
  name: 'acquisitionStatus',
  labelName: 'move',
  component: 'select',
  data: [aquisitionStatuses.find(({ value }) => type === value)],
});
