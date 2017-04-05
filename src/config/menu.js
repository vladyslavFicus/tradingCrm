import Permissions, { CONDITIONS } from '../utils/permissions';
import permission from './permissions';

const sidebarTopMenu = [
  {
    label: 'Players',
    icon: 'fa fa-users',
    items: [
      { label: 'All', url: '/users/list' },
      { label: 'Dormant', url: '/users/dormant' },
    ],
  },
  {
    label: 'Operators',
    icon: 'fa fa-user',
    url: '/operators/list',
  },
  {
    label: 'Payments',
    icon: 'fa fa-credit-card',
    items: [
      { label: 'All', url: '/payments' },
      { label: 'Open loop', url: '/payments/open-loops' },
    ],
  },
  { label: 'Bonus campaigns', url: '/bonus-campaigns', icon: 'fa fa-gift' },
  { label: 'Terms & conditions', url: '/terms', icon: 'fa fa-align-justify' },
  {
    label: 'Reports',
    icon: 'fa fa-align-justify',
    items: [
      {
        label: 'Player liability',
        url: '/reports/player-liability',
        permissions: new Permissions([
          permission.REPORTS.PLAYER_LIABILITY_VIEW,
          permission.REPORTS.PLAYER_LIABILITY_FILE_VIEW,
          permission.REPORTS.PLAYER_LIABILITY_FILES_VIEW,
        ], CONDITIONS.OR),
      },
      {
        label: 'Revenue',
        url: '/reports/revenue',
        permissions: new Permissions([permission.REPORTS.VAT_VIEW]),
      },
    ],
  },
];
const sidebarBottomMenu = [
  { label: 'Support', icon: 'fa fa-life-ring', url: '#' },
];

const userProfileTabs = [
  { label: 'Profile', url: '/users/:id/profile' },
  { label: 'Bonuses', url: '/users/:id/bonuses' },
  { label: 'Game activity', url: '/users/:id/game-activity' },
  { label: 'Transactions', url: '/users/:id/transactions' },
  { label: 'Limits', url: '/users/:id/limits' },
  { label: 'Files', url: '/users/:id/files' },
  { label: 'Notes', url: '/users/:id/notes' },
  { label: 'Feed', url: '/users/:id/feed' },
];

const operatorProfileTabs = [
  { label: 'Profile', url: '/operators/:id/profile' },
];

export {
  sidebarTopMenu,
  sidebarBottomMenu,
  userProfileTabs,
  operatorProfileTabs,
};
