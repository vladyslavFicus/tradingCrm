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
  url: '/dashboard',
}, {
  label: 'SIDEBAR.TOP_MENU.CLIENTS',
  icon: 'icon-users',
  isOpen: false,
  items: [{
    label: 'SIDEBAR.TOP_MENU.SEARCH_CLIENTS',
    url: '/clients/list',
    permissions: new Permissions(permissions.USER_PROFILE.PROFILES_LIST),
  }, {
    label: 'SIDEBAR.TOP_MENU.KYC_DOCUMENTS',
    url: '/clients/kyc-documents',
    permissions: new Permissions(permissions.FILES.SEARCH_FILES),
  }, {
    label: 'SIDEBAR.TOP_MENU.TRADING_ACCOUNTS',
    url: '/trading-accounts/list',
    permissions: new Permissions(permissions.TRADING_ACCOUNTS.GET_TRADING_ACCOUNTS),
  }],
}, {
  label: 'SIDEBAR.TOP_MENU.LEADS',
  icon: 'icon-leads SidebarNavItem__icon--leads',
  url: '/leads/list',
  permissions: new Permissions(permissions.LEADS.GET_LEADS),
}, {
  label: 'SIDEBAR.TOP_MENU.HIERARCHY',
  icon: 'icon-organization',
  url: '/hierarchy/tree',
  permissions: new Permissions(permissions.HIERARCHY.GET_TREE),
}, {
  label: 'SIDEBAR.TOP_MENU.MANAGEMENT',
  icon: 'icon-operators SidebarNavItem__icon--operators',
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
    permissions: new Permissions(permissions.PARTNERS.PARTNERS_LIST_VIEW),
  }],
}, {
  label: 'SIDEBAR.TOP_MENU.PAYMENTS',
  icon: 'icon-payments SidebarNavItem__icon--payments',
  url: '/payments/list',
  permissions: new Permissions(permissions.PAYMENTS.PAYMENTS_LIST),
}, {
  label: 'SIDEBAR.TOP_MENU.CALLBACKS',
  icon: 'icon-callbacks',
  url: '/callbacks/list',
  permissions: new Permissions(permissions.CALLBACKS.LIST),
}, {
  label: 'SIDEBAR.TOP_MENU.NOTIFICATIONS',
  icon: 'icon-notifications',
  url: '/notifications',
  permissions: new Permissions(permissions.NOTIFICATION_CENTER.LIST),
}, {
  label: 'SIDEBAR.TOP_MENU.CLIENTS_DISTRIBUTION',
  icon: 'icon-union',
  url: '/distribution',
  permissions: new Permissions(permissions.CLIENTS_DISTRIBUTION.LIST),
}, {
  label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE',
  icon: 'icon-union',
  url: '/trading-engine',
  permissions: new Permissions(permissions.TRADING_ENGINE.GET_ACCOUNTS),
}, {
  label: 'SIDEBAR.TOP_MENU.SETTINGS',
  icon: 'icon-settings',
  isOpen: false,
  items: [{
    label: 'SIDEBAR.TOP_MENU.EMAIL_TEMPLATES',
    url: '/email-templates',
    permissions: new Permissions(permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE),
  }, {
    label: 'SIDEBAR.TOP_MENU.ROLES_AND_PERMISSIONS',
    url: '/roles-and-permissions',
    permissions: new Permissions(permissions.AUTH.UPDATE_ACTIONS),
  }],
}];

const sidebarBottomMenu = [{
  label: 'SIDEBAR.BOTTOM_MENU.RELEASE_NOTES',
  icon: 'icon-support',
  url: '/release-notes',
}];

const operatorTabs = (isSales) => {
  const tabs = [
    { label: 'OPERATOR_PROFILE.TABS.PROFILE', url: '/operators/:id/profile' },
    {
      label: 'OPERATOR_PROFILE.TABS.FEED',
      url: '/operators/:id/feed',
      permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
    },
  ];

  // Check if operator profile userType is SALES to show sales rules tab
  if (isSales) {
    tabs.push({
      label: 'OPERATOR_PROFILE.TABS.SALES_RULES',
      url: '/operators/:id/sales-rules',
      permissions: new Permissions(permissions.SALES_RULES.GET_RULES),
    });
  }

  return tabs;
};

const partnerTabs = [
  { label: 'PARTNER_PROFILE.TABS.PROFILE', url: '/partners/:id/profile' },
  {
    label: 'PARTNER_PROFILE.TABS.SALES_RULES',
    url: '/partners/:id/sales-rules',
    permissions: new Permissions(permissions.SALES_RULES.GET_RULES),
  },
  {
    label: 'PARTNER_PROFILE.TABS.FEED',
    url: '/partners/:id/feed',
    permissions: new Permissions(permissions.AUDIT.AUDIT_LOGS),
  },
];

export {
  partnerTabs,
  operatorTabs,
  sidebarTopMenu,
  sidebarBottomMenu,
  operatorsExcludeAuthorities,
};
