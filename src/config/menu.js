import Permissions, { CONDITIONS } from '../utils/permissions';
import permission from './permissions';
import I18n from '../utils/fake-i18n';

const sidebarTopMenu = [
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS'),
    icon: 'fa fa-users',
    items: [
      { label: I18n.t('SIDEBAR.TOP_MENU.COMMON.ALL'), url: '/users/list' },
      { label: I18n.t('SIDEBAR.TOP_MENU.DORMANT'), url: '/users/dormant' },
    ],
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
    icon: 'fa fa-user',
    url: '/operators/list',
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.TRANSACTIONS'),
    icon: 'fa fa-credit-card',
    items: [
      { label: I18n.t('SIDEBAR.TOP_MENU.COMMON.ALL'), url: '/transactions' },
      { label: I18n.t('SIDEBAR.TOP_MENU.OPEN_LOOP'), url: '/transactions/open-loops' },
    ],
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'),
    icon: 'fa fa-cc-visa',
    url: '/paymentMethods',
  },
  { label: I18n.t('SIDEBAR.TOP_MENU.BONUS_CAMPAIGNS'), url: '/bonus-campaigns', icon: 'fa fa-gift' },
  { label: I18n.t('SIDEBAR.TOP_MENU.TERMS'), url: '/terms', icon: 'fa fa-align-justify' },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.REPORTS'),
    icon: 'fa fa-align-justify',
    items: [
      {
        label: I18n.t('SIDEBAR.TOP_MENU.PLAYER_LIABILITY'),
        url: '/reports/player-liability',
        permissions: new Permissions([
          permission.REPORTS.PLAYER_LIABILITY_VIEW,
          permission.REPORTS.PLAYER_LIABILITY_FILE_VIEW,
          permission.REPORTS.PLAYER_LIABILITY_FILES_VIEW,
        ], CONDITIONS.OR),
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.REVENUE'),
        url: '/reports/revenue',
        permissions: new Permissions([permission.REPORTS.VAT_VIEW]),
      },
    ],
  },
];
const sidebarBottomMenu = [
  { label: I18n.t('SIDEBAR.BOTTOM_MENU.SUPPORT'), icon: 'fa fa-life-ring', url: '#' },
];

const userProfileTabs = [
  { label: 'Profile', url: '/users/:id/profile' },
  { label: 'Bonuses', url: '/users/:id/bonuses' },
  { label: 'Game activity', url: '/users/:id/game-activity' },
  { label: 'Transactions', url: '/users/:id/transactions' },
  { label: 'Payments', url: '/users/:id/paymentAccounts' },
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
