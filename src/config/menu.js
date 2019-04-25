import I18n from 'utils/fake-i18n';
import { services } from 'constants/services';
import { departments, roles } from 'constants/brands';
import Permissions from 'utils/permissions';
import permissions from './permissions';

const operatorsExcludeAuthorities = [{
  department: departments.SALES,
  role: roles.ROLE1,
}, {
  department: departments.RETENTION,
  role: roles.ROLE1,
}];

const sidebarTopMenu = [{
  label: I18n.t('SIDEBAR.TOP_MENU.DASHBOARD'),
  icon: 'icon-dashboard',
  service: services.trading_payment,
  items: [{
    label: I18n.t('SIDEBAR.TOP_MENU.DASHBOARD_ITEMS.DEFAULT'),
    url: '/dashboard',
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.DASHBOARD_ITEMS.PERSONAL'),
    url: '/personal-dashboard',
  }],
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
  permissions: new Permissions(permissions.LEADS.GET_LEADS),
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.HIERARCHY'),
  icon: 'icon-organization',
  url: '/hierarchy/tree',
  permissions: new Permissions(permissions.HIERARCHY.GET_TREE),
}, {
  label: I18n.t('SIDEBAR.TOP_MENU.MANAGEMENT'),
  icon: 'icon-operators sidebar-nav-item__icon--operators',
  isOpen: false,
  items: [{
    label: I18n.t('SIDEBAR.TOP_MENU.OFFICES'),
    url: '/offices',
    permissions: new Permissions(permissions.HIERARCHY.GET_OFFICES),
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.DESKS'),
    url: '/desks',
    permissions: new Permissions(permissions.HIERARCHY.GET_DESKS),
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.TEAMS'),
    url: '/teams',
    permissions: new Permissions(permissions.HIERARCHY.GET_TEAMS),
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
    url: '/operators',
    service: services.operator,
    permissions: new Permissions(permissions.HIERARCHY.GET_OPERATORS),
    excludeAuthorities: operatorsExcludeAuthorities,
  }, {
    label: I18n.t('SIDEBAR.TOP_MENU.PARTNERS'),
    url: '/partners',
    permissions: new Permissions(permissions.HIERARCHY.GET_AFFILIATE_PARTNERS),
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

const sidebarBottomMenu = [{
  label: I18n.t('SIDEBAR.BOTTOM_MENU.RELEASE_NOTES'),
  icon: 'icon-support',
  url: '/release-notes',
}];

const operatorProfileTabs = [
  { label: 'Profile', url: '/operators/:id/profile' },
  { label: 'Feed', url: '/operators/:id/feed' },
];
const partnerProfileTabs = [
  { label: 'Profile', url: '/partners/:id/profile' },
  { label: 'Feed', url: '/partners/:id/feed' },
];

export {
  operatorProfileTabs,
  partnerProfileTabs,
  sidebarTopMenu,
  sidebarBottomMenu,
  operatorsExcludeAuthorities,
};
