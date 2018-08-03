import permissions from './permissions';
import I18n from '../utils/fake-i18n';
import Permissions, { CONDITIONS } from '../utils/permissions';
import { services } from '../constants/services';
import { markets } from '../constants/markets';
import config from './index';

const userProfileTabs = [
  {
    label: 'Profile',
    url: '/players/:id/profile',
    permissions: new Permissions(permissions.USER_PROFILE.PROFILE_VIEW),
  },
  {
    label: 'Transactions',
    url: '/players/:id/transactions',
    permissions: new Permissions([
      permissions.PAYMENTS.PLAYER_PAYMENTS_LIST,
      permissions.GAMING_ACTIVITY.PLAYER_GAMING_ACTIVITY,
    ], CONDITIONS.OR),
  },
  {
    label: 'Rewards',
    url: '/players/:id/rewards',
    permissions: new Permissions([
      permissions.BONUS.PLAYER_BONUSES_LIST,
      permissions.FREE_SPIN.PLAYER_FREE_SPIN_LIST,
      permissions.PROMOTION.PLAYER_CAMPAIGN_ACTIVE_LIST,
      permissions.PROMOTION.PLAYER_CAMPAIGN_AVAILABLE_LIST,
    ], CONDITIONS.OR),
  },
  {
    label: 'Payment acc.',
    url: '/players/:id/paymentAccounts',
    permissions: new Permissions(permissions.PAYMENT.PLAYER_ACCOUNT_LIST),
  },
  {
    label: 'Limits',
    url: '/players/:id/limits',
    permissions: new Permissions(permissions.PAYMENT.PLAYER_LIMITS_LIST),
  },
  {
    label: 'Files',
    url: '/players/:id/files',
    permissions: new Permissions(permissions.USER_PROFILE.VIEW_FILES),
  },
  {
    label: 'Devices',
    url: '/players/:id/devices',
    permissions: new Permissions(permissions.USER_PROFILE.PROFILE_DEVICES_VIEW),
  },
  {
    label: 'Notes',
    url: '/players/:id/notes',
    permissions: new Permissions(permissions.NOTE.NOTES_LIST),
  },
  {
    label: 'Feed',
    url: '/players/:id/feed',
    permissions: new Permissions(permissions.AUDIT.PLAYER_AUDIT_LOGS),
  },
];

const profilesRoute = {
  label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS'),
  icon: 'icon-users',
  isOpen: false,
  items: [
    {
      label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS_SEARCH'),
      url: '/players/list',
      service: services.profile,
      permissions: new Permissions(permissions.USER_PROFILE.PROFILES_LIST),
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS_KYC_REQUEST'),
      url: '/players/kyc-requests',
      service: services.profile,
      permissions: new Permissions(permissions.USER_PROFILE.KYC_LIST),
    },
  ],
};

const clientsRoute = {
  label: I18n.t('SIDEBAR.TOP_MENU.CLIENTS'),
  icon: 'icon-users',
  url: '/clients/list',
  permissions: new Permissions(permissions.OPERATORS.OPERATORS_LIST_VIEW),
};

const sidebarTopMenu = [
  { ...(config.market === markets.crm ? clientsRoute : profilesRoute) },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
    icon: 'icon-operators sidebar-nav-item__icon--operators',
    url: '/operators/list',
    service: services.operator,
    permissions: new Permissions(permissions.OPERATORS.OPERATORS_LIST_VIEW),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.PAYMENTS'),
    icon: 'icon-payments sidebar-nav-item__icon--payments',
    url: '/transactions/list',
    service: services.payment,
    permissions: new Permissions(permissions.PAYMENTS.LIST),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.BONUS_CAMPAIGNS'),
    icon: 'fa fa-gift',
    url: '/bonus-campaigns',
    service: services.promotion,
    permissions: new Permissions(permissions.PROMOTION.LIST),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.CAMPAIGNS'),
    icon: 'icon-campaigns',
    url: '/campaigns',
    service: services.campaign,
    permissions: new Permissions(permissions.CAMPAIGNS.LIST),
  },
  {
    label: I18n.t('SIDEBAR.TOP_MENU.SETTINGS'),
    icon: 'icon-settings',
    isOpen: false,
    items: [
      {
        label: I18n.t('SIDEBAR.TOP_MENU.CMS_GAMES'),
        url: '/settings/cms-games',
        service: services.cms,
        permissions: new Permissions(permissions.CMS_GAMES.VIEW_LIST),
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.GAMES'),
        url: '/settings/games',
        service: services.game_info,
        permissions: new Permissions(permissions.GAME_INFO.GET_GAME_LIST_CSV),
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'),
        url: '/settings/paymentMethods',
        service: services.payment,
        permissions: new Permissions(permissions.PAYMENT.PAYMENT_METHODS_LIST),
      },
    ],
  },
];

const sidebarBottomMenu = [
  { label: I18n.t('SIDEBAR.BOTTOM_MENU.SUPPORT'), icon: 'icon-support', url: '#' },
];

const bonusCampaignTabs = [
  { label: 'Settings', url: '/bonus-campaigns/view/:id/settings' },
  { label: 'Feed', url: '/bonus-campaigns/view/:id/feed' },
];
const newBonusCampaignTabs = [
  { label: 'Settings', url: '/campaigns/view/:id/settings' },
];
const operatorProfileTabs = [
  { label: 'Profile', url: '/operators/:id/profile' },
  { label: 'Feed', url: '/operators/:id/feed' },
];

export {
  userProfileTabs,
  operatorProfileTabs,
  bonusCampaignTabs,
  newBonusCampaignTabs,
  sidebarTopMenu,
  sidebarBottomMenu,
};
