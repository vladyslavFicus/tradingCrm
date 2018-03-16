import permissions from './permissions';
import I18n from '../utils/fake-i18n';
import Permissions, { CONDITIONS } from '../utils/permissions';

const userProfileTabs = [
  {
    label: 'Profile',
    url: '/users/:id/profile',
    permissions: new Permissions(permissions.USER_PROFILE.PROFILE_VIEW),
  },
  {
    label: 'Transactions',
    url: '/users/:id/transactions',
    permissions: new Permissions([
      permissions.PAYMENTS.PLAYER_PAYMENTS_LIST,
      permissions.GAMING_ACTIVITY.PLAYER_GAMING_ACTIVITY,
    ], CONDITIONS.OR),
  },
  {
    label: 'Rewards',
    url: '/users/:id/rewards',
    permissions: new Permissions([
      permissions.BONUS.PLAYER_BONUSES_LIST,
      permissions.FREE_SPIN.PLAYER_FREE_SPIN_LIST,
      permissions.PROMOTION.PLAYER_CAMPAIGN_ACTIVE_LIST,
      permissions.PROMOTION.PLAYER_CAMPAIGN_AVAILABLE_LIST,
    ], CONDITIONS.OR),
  },
  {
    label: 'Payment acc.',
    url: '/users/:id/paymentAccounts',
    permissions: new Permissions(permissions.PAYMENT.PLAYER_ACCOUNT_LIST),
  },
  {
    label: 'Limits',
    url: '/users/:id/limits',
    permissions: new Permissions(permissions.PAYMENT.PLAYER_LIMITS_LIST),
  },
  {
    label: 'Files',
    url: '/users/:id/files',
    permissions: new Permissions(permissions.USER_PROFILE.VIEW_FILES),
  },
  {
    label: 'Devices',
    url: '/users/:id/devices',
    permissions: new Permissions(permissions.USER_PROFILE.PROFILE_DEVICES_VIEW),
  },
  {
    label: 'Notes',
    url: '/users/:id/notes',
    permissions: new Permissions(permissions.NOTE.NOTES_LIST),
  },
  {
    label: 'Feed',
    url: '/users/:id/feed',
    permissions: new Permissions(permissions.AUDIT.PLAYER_AUDIT_LOGS),
  },
];

const sidebarTopMenu = [
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS'),
    icon: 'fa fa-users',
    isOpen: false,
    items: [
      {
        label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS_SEARCH'),
        url: '/users/list',
        permissions: new Permissions(permissions.USER_PROFILE.PROFILES_LIST),
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS_KYC_REQUEST'),
        url: '/users/kyc-requests',
        permissions: new Permissions(permissions.USER_PROFILE.KYC_LIST),
      },
    ],
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
    icon: 'fa fa-eye',
    url: '/operators/list',
    permissions: new Permissions(permissions.OPERATORS.OPERATORS_LIST_VIEW),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PAYMENTS'),
    icon: 'fa fa-credit-card',
    url: '/transactions/list',
    permissions: new Permissions(permissions.PAYMENTS.LIST),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.BONUS_CAMPAIGNS'),
    icon: 'fa fa-gift',
    url: '/bonus-campaigns',
    permissions: new Permissions(permissions.PROMOTION.LIST),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.NEW_CAMPAIGNS'),
    icon: 'fa fa-calendar-check-o ',
    isOpen: false,
    items: [
      {
        label: I18n.t('SIDEBAR.TOP_MENU.NEW_CAMPAIGNS_FULFILLMENTS'),
        url: '/new-bonus-campaigns/fulfilments',
        permissions: new Permissions(permissions.WAGERING_FULFILLMENT.LIST),
      },
    ],
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.SETTINGS'),
    icon: 'fa fa-gear',
    isOpen: false,
    items: [
      {
        label: I18n.t('SIDEBAR.TOP_MENU.GAMES'),
        url: '/settings/games',
        permissions: new Permissions(permissions.GAME_INFO.GET_GAME_LIST_CSV),
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'),
        url: '/settings/paymentMethods',
        permissions: new Permissions(permissions.PAYMENT.PAYMENT_METHODS_LIST),
      },
    ],
  },
];

const sidebarBottomMenu = [
  { label: I18n.t('SIDEBAR.BOTTOM_MENU.SUPPORT'), icon: 'fa fa-life-ring', url: '#' },
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
  sidebarTopMenu,
  sidebarBottomMenu,
};
