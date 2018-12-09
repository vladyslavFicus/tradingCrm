import I18n from '../utils/fake-i18n';
import { services } from '../constants/services';

const sidebarTopMenu = [{
  label: I18n.t('SIDEBAR.TOP_MENU.DASHBOARD'),
  icon: 'icon-dashboard',
  url: '/dashboard',
  service: services.reconciliation,
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.CLIENTS'),
  icon: 'icon-users',
  url: '/clients/list',
  service: services.profile,
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.LEADS'),
  icon: 'icon-leads sidebar-nav-item__icon--leads',
  url: '/leads/list',
  service: services.trading_lead_updater,
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.MANAGEMENT'),
  icon: 'icon-operators sidebar-nav-item__icon--operators',
  isOpen: false,
  onlyAdministrator: true,
  items: [{
    label: I18n.t('SIDEBAR.TOP_MENU.OFFICES'),
    url: '/offices',
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.DESKS'),
    url: '/desks',
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.TEAMS'),
    url: '/teams',
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
    url: '/operators',
    service: services.operator,
  }],
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.PAYMENTS'),
  icon: 'icon-payments sidebar-nav-item__icon--payments',
  url: '/payments',
  service: services.payment,
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.CALLBACKS'),
  icon: 'icon-callbacks',
  url: '/callbacks',
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.SETTINGS'),
  icon: 'icon-settings',
  isOpen: false,
  items: [{
    label: I18n.t('SIDEBAR.TOP_MENU.CMS_GAMES'),
    url: '/settings/cms-games',
    service: services.cms,
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.GAMES'),
    url: '/settings/games',
    service: services.game_info,
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'),
    url: '/settings/paymentMethods',
    service: services.payment,
  }],
}];

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
  operatorProfileTabs,
  bonusCampaignTabs,
  newBonusCampaignTabs,
  sidebarTopMenu,
  sidebarBottomMenu,
};
