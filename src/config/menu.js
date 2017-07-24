import Permissions, { CONDITIONS } from '../utils/permissions';
import permission from './permissions';
import I18n from '../utils/fake-i18n';

const sidebarTopMenu = [
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS'),
    icon: 'fa fa-users',
    url: '/users/list',
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
    icon: 'fa fa-eye',
    url: '/operators/list',
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PAYMENTS'),
    icon: 'fa fa-credit-card',
    items: [
      { label: I18n.t('SIDEBAR.TOP_MENU.TRANSACTIONS'), url: '/transactions' },
      { label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'), url: '/paymentMethods' },
    ],
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.BONUS_CAMPAIGNS'),
    icon: 'fa fa-gift',
    url: '/bonus-campaigns',
  },
  {
    label: 'MGA',
    icon: 'fa fa-pie-chart',
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
      {
        label: I18n.t('SIDEBAR.TOP_MENU.DORMANT'),
        url: '/users/dormant',
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.OPEN_LOOP'),
        url: '/transactions/open-loops',
      },
    ],
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.GAMES'),
    icon: 'fa fa-gamepad',
    url: '/games',
  },
];
const sidebarBottomMenu = [
  { label: I18n.t('SIDEBAR.BOTTOM_MENU.SUPPORT'), icon: 'fa fa-life-ring', url: '#' },
];
const userProfileTabs = [
  { label: 'Profile', url: '/users/:id/profile' },
  { label: 'Transactions', url: '/users/:id/transactions' },
  { label: 'Awards', url: '/users/:id/awards' },
  { label: 'Activity', url: '/users/:id/game-activity' },
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
  sidebarTopMenu,
  sidebarBottomMenu,
  userProfileTabs,
  operatorProfileTabs,
  bonusCampaignTabs,
};
