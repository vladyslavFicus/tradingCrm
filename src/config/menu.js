import permissions from './permissions';

const userProfileTabs = [
  {
    label: 'Profile',
    url: '/users/:id/profile',
    permissions: [
      permissions.USER_PROFILE.PROFILE_VIEW,
    ],
  },
  { label: 'Transactions', url: '/users/:id/transactions' },
  { label: 'Rewards', url: '/users/:id/rewards' },
  { label: 'Payment acc.', url: '/users/:id/paymentAccounts' },
  { label: 'Limits', url: '/users/:id/limits' },
  { label: 'Files', url: '/users/:id/files' },
  { label: 'Devices', url: '/users/:id/devices' },
  { label: 'Notes', url: '/users/:id/notes' },
  { label: 'Feed', url: '/users/:id/feed' },
];

const bonusCampaignTabs = [
  { label: 'Settings', url: '/bonus-campaigns/view/:id/settings' },
  { label: 'Feed', url: '/bonus-campaigns/view/:id/feed' },
];
const operatorProfileTabs = [
  { label: 'Profile', url: '/operators/:id/profile' },
  { label: 'Feed', url: '/operators/:id/feed' },
];

export {
  userProfileTabs,
  operatorProfileTabs,
  bonusCampaignTabs,
};
