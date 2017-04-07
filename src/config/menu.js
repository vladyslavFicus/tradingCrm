import Permissions, { CONDITIONS } from '../utils/permissions';
import permission from './permissions';

const sidebarTopMenu = [
  {
    label: 'Players',
    icon: 'fa fa-users',
    url: '/users/list',
  },
  {
    label: 'Operators',
    icon: 'fa fa-eye',
    url: '/operators/list',
  },
  {
    label: 'Payments',
    icon: 'fa fa-credit-card',
    url: '/payments',
    items: [
      { label: 'Transactions', url: '/payments' },
      { label: 'Payment methods', url: '/payment-methods' },
    ],
  },
  {
    label: 'Bonus campaigns',
    icon: 'fa fa-gift',
    url: '/bonus-campaigns',
  },
  {
    label: 'MGA',
    icon: 'fa fa-pie-chart',
    url: '/reports/player-liability',
    items: [
      { label: 'Player liability report', url: '/reports/player-liability' },
      { label: 'Revenue report', url: '/reports/revenue' },
      { label: 'Dormant players', url: '/users/dormant' },
      { label: 'Open loops', url: '/payments/open-loops' },
    ],
  },
  {
    label: 'Settings',
    icon: 'fa fa-cog',
    url: '/settings/countries',
    items: [
      { label: 'Countries', url: '/settings/countries' },
    ],
  },
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
