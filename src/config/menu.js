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
  label: 'SIDEBAR.TOP_MENU.DASHBOARD',
  icon: 'icon-dashboard',
  items: [{
    label: 'SIDEBAR.TOP_MENU.DASHBOARD_ITEMS.DEFAULT',
    url: '/dashboard',
  }, {
    label: 'SIDEBAR.TOP_MENU.DASHBOARD_ITEMS.PERSONAL',
    url: '/personal-dashboard',
  }],
}, {
  label: 'SIDEBAR.TOP_MENU.CLIENTS',
  icon: 'icon-users',
  isOpen: false,
  items: [{
    label: 'SIDEBAR.TOP_MENU.SEARCH_CLIENTS',
    url: '/clients/list',
  }, {
    label: 'SIDEBAR.TOP_MENU.KYC_DOCUMENTS',
    url: '/clients/kyc-documents',
    permissions: new Permissions(permissions.FILES.SEARCH_FILES),
  }],
}, {
  label: 'SIDEBAR.TOP_MENU.LEADS',
  icon: 'icon-leads sidebar-nav-item__icon--leads',
  url: '/leads/list',
  permissions: new Permissions(permissions.LEADS.GET_LEADS),
}, {
  label: 'SIDEBAR.TOP_MENU.HIERARCHY',
  icon: 'icon-organization',
  url: '/hierarchy/tree',
  permissions: new Permissions(permissions.HIERARCHY.GET_TREE),
}, {
  label: 'SIDEBAR.TOP_MENU.MANAGEMENT',
  icon: 'icon-operators sidebar-nav-item__icon--operators',
  isOpen: false,
  items: [{
    label: 'SIDEBAR.TOP_MENU.OFFICES',
    url: '/offices/list',
    permissions: new Permissions(permissions.HIERARCHY.GET_OFFICES),
  }, {
    label: 'SIDEBAR.TOP_MENU.DESKS',
    url: '/desks/list',
    permissions: new Permissions(permissions.HIERARCHY.GET_DESKS),
  }, {
    label: 'SIDEBAR.TOP_MENU.TEAMS',
    url: '/teams/list',
    permissions: new Permissions(permissions.HIERARCHY.GET_TEAMS),
  }, {
    label: 'SIDEBAR.TOP_MENU.SALES_RULES',
    url: '/sales-rules',
    permissions: new Permissions(permissions.SALES_RULES.GET_RULES),
  }, {
    label: 'SIDEBAR.TOP_MENU.OPERATORS',
    url: '/operators/list',
    permissions: new Permissions(permissions.HIERARCHY.GET_OPERATORS),
    excludeAuthorities: operatorsExcludeAuthorities,
  }, {
    label: 'SIDEBAR.TOP_MENU.PARTNERS',
    url: '/partners/list',
    permissions: new Permissions(permissions.HIERARCHY.GET_AFFILIATE_PARTNERS),
  }],
}, {
  label: 'SIDEBAR.TOP_MENU.PAYMENTS',
  icon: 'icon-payments sidebar-nav-item__icon--payments',
  url: '/payments/list',
}, {
  label: 'SIDEBAR.TOP_MENU.CALLBACKS',
  icon: 'icon-callbacks',
  url: '/callbacks/list',
}, {
  label: 'SIDEBAR.TOP_MENU.SETTINGS',
  icon: 'icon-settings',
  isOpen: false,
  items: [{
    label: 'SIDEBAR.TOP_MENU.BRAND_CONFIG_UPDATE',
    url: '/brand-config/update',
    permissions: new Permissions(permissions.BRAND_CONFIG.UPDATE_BRAND_CONFIG),
  }, {
    label: 'SIDEBAR.TOP_MENU.BRAND_CONFIG_CREATE',
    url: '/brand-config/create',
    permissions: new Permissions(permissions.BRAND_CONFIG.CREATE_BRAND_CONFIG),
  }, {
    label: 'SIDEBAR.TOP_MENU.EMAIL_TEMPLATES',
    url: '/email-templates',
    permissions: new Permissions(permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE),
  }],
}];

const sidebarBottomMenu = [{
  label: 'SIDEBAR.BOTTOM_MENU.RELEASE_NOTES',
  icon: 'icon-support',
  url: '/release-notes',
}];

const operatorProfileTabs = [
  { label: 'OPERATOR_PROFILE.TABS.PROFILE', url: '/operators/:id/profile' },
  { label: 'OPERATOR_PROFILE.TABS.FEED', url: '/operators/:id/feed' },
];
const partnerProfileTabs = [
  { label: 'OPERATOR_PROFILE.TABS.PROFILE', url: '/partners/:id/profile' },
  { label: 'OPERATOR_PROFILE.TABS.FEED', url: '/partners/:id/feed' },
];

export {
  operatorProfileTabs,
  partnerProfileTabs,
  sidebarTopMenu,
  sidebarBottomMenu,
  operatorsExcludeAuthorities,
};
