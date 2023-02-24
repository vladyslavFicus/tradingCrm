import { CONDITIONS } from 'utils/permissions';
import permissions from './permissions';

export type SidebarMenuSubItem = {
  label: string,
  url: string,
  permissions?: string,
  icon?: string,
  conditions?: string,
};

export type SidebarMenuItem = {
  label: string,
  icon: string,
  url?: string,
  conditions?: string,
  permissions?: Array<string> | string,
  isOpen?: boolean,
  items?: Array<SidebarMenuSubItem>,
};

export const sidebarTopMenu: Array<SidebarMenuItem> = [
  {
    label: 'SIDEBAR.TOP_MENU.DASHBOARD',
    icon: 'icon-dashboard',
    url: '/dashboard',
    conditions: CONDITIONS.OR,
    permissions: [
      permissions.DASHBOARD.REGISTRATIONS,
      permissions.DASHBOARD.DEPOSITS_AMOUNT,
      permissions.DASHBOARD.DEPOSITS_COUNT,
      permissions.DASHBOARD.WITHDRAWAL_AMOUNT,
      permissions.DASHBOARD.WITHDRAWAL_COUNT,
      permissions.DASHBOARD.RETENTION_AMOUNT,
      permissions.DASHBOARD.RETENTION_COUNT,
      permissions.DASHBOARD.FTR_AMOUNT,
      permissions.DASHBOARD.FTR_COUNT,
      permissions.DASHBOARD.FTD_AMOUNT,
      permissions.DASHBOARD.FTD_COUNT,
      permissions.DASHBOARD.LATEST_DEPOSITS,
      permissions.DASHBOARD.LATEST_WITHDRAWALS,
      permissions.DASHBOARD.LATEST_REGISTRATIONS,
      permissions.DASHBOARD.LATEST_NOTIFICATIONS,
      permissions.DASHBOARD.SCREENER_WIDGET,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.CLIENTS',
    icon: 'icon-users',
    isOpen: false,
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.SEARCH_CLIENTS',
        url: '/clients/list',
        permissions: permissions.USER_PROFILE.PROFILES_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.KYC_DOCUMENTS',
        url: '/clients/kyc-documents',
        permissions: permissions.FILES.SEARCH_FILES,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ACCOUNTS',
        url: '/trading-accounts/list',
        permissions: permissions.TRADING_ACCOUNTS.GET_TRADING_ACCOUNTS,
      },
      {
        label: 'SIDEBAR.TOP_MENU.CLIENT_CALLBACKS',
        url: '/clients/callbacks/list',
        permissions: permissions.USER_PROFILE.CALLBACKS_LIST,
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.LEADS',
    icon: 'icon-leads SidebarNavItem__icon--leads',
    isOpen: false,
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.SEARCH_LEADS',
        url: '/leads/list',
        permissions: permissions.LEADS.GET_LEADS,
      },
      {
        label: 'SIDEBAR.TOP_MENU.LEAD_CALLBACKS',
        url: '/leads/callbacks/list',
        permissions: permissions.LEAD_PROFILE.CALLBACKS_LIST,
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.HIERARCHY',
    icon: 'icon-organization',
    url: '/hierarchy/tree',
    permissions: permissions.HIERARCHY.GET_TREE,
  },
  {
    label: 'SIDEBAR.TOP_MENU.MANAGEMENT',
    icon: 'icon-operators SidebarNavItem__icon--operators',
    isOpen: false,
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.OFFICES',
        url: '/offices/list',
        permissions: permissions.HIERARCHY.GET_OFFICES,
      },
      {
        label: 'SIDEBAR.TOP_MENU.DESKS',
        url: '/desks/list',
        permissions: permissions.HIERARCHY.GET_DESKS,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TEAMS',
        url: '/teams/list',
        permissions: permissions.HIERARCHY.GET_TEAMS,
      },
      {
        label: 'SIDEBAR.TOP_MENU.SALES_RULES',
        url: '/sales-rules',
        permissions: permissions.SALES_RULES.GET_RULES,
      },
      {
        label: 'SIDEBAR.TOP_MENU.OPERATORS',
        url: '/operators/list',
        permissions: permissions.HIERARCHY.GET_OPERATORS,
      },
      {
        label: 'SIDEBAR.TOP_MENU.PARTNERS',
        url: '/partners/list',
        permissions: permissions.PARTNERS.PARTNERS_LIST_VIEW,
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.DOCUMENTS',
    icon: 'icon-file-text2',
    url: '/documents',
    permissions: permissions.DOCUMENTS.SEARCH_DOCUMENT,
  },
  {
    label: 'SIDEBAR.TOP_MENU.PAYMENTS',
    icon: 'icon-payments SidebarNavItem__icon--payments',
    url: '/payments/list',
    permissions: permissions.PAYMENTS.PAYMENTS_LIST,
  },
  {
    label: 'SIDEBAR.TOP_MENU.NOTIFICATIONS',
    icon: 'icon-notifications',
    url: '/notifications',
    permissions: permissions.NOTIFICATION_CENTER.LIST,
  },
  {
    label: 'SIDEBAR.TOP_MENU.CLIENTS_DISTRIBUTION',
    icon: 'icon-union',
    url: '/distribution',
    permissions: permissions.CLIENTS_DISTRIBUTION.LIST,
  },
  {
    label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.TITLE',
    icon: 'icon-trading-engine',
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.ACCOUNTS',
        url: '/trading-engine/accounts',
        permissions: permissions.WE_TRADING.ACCOUNTS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.ORDERS',
        url: '/trading-engine/orders',
        permissions: permissions.WE_TRADING.ORDERS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.QUOTES',
        url: '/trading-engine/quotes',
        permissions: permissions.WE_TRADING.SYMBOLS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.MARGIN_CALLS',
        url: '/trading-engine/margin-calls',
        permissions: permissions.WE_TRADING.ACCOUNTS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.SYMBOLS',
        url: '/trading-engine/symbols',
        permissions: permissions.WE_TRADING.SYMBOLS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.GROUPS',
        url: '/trading-engine/groups',
        permissions: permissions.WE_TRADING.GROUPS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.SECURITIES',
        url: '/trading-engine/securities',
        permissions: permissions.WE_TRADING.SECURITIES_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.HOLIDAYS',
        url: '/trading-engine/holidays',
        permissions: permissions.WE_TRADING.HOLIDAYS_LIST,
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.OPERATORS',
        url: '/trading-engine/operators',
        permissions: permissions.WE_TRADING.OPERATORS_LIST,
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.IP_WHITELIST',
    icon: 'icon-ip-whitelist',
    url: '/ip-whitelist',
    permissions: permissions.IP_WHITELIST.LIST,
  },
  {
    label: 'SIDEBAR.TOP_MENU.SETTINGS.TITLE',
    icon: 'icon-settings',
    isOpen: false,
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.EMAIL_TEMPLATES',
        url: '/email-templates',
        permissions: permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE,
      },
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.ROLES_AND_PERMISSIONS',
        url: '/roles-and-permissions',
        permissions: permissions.AUTH.UPDATE_ACTIONS,
      },
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.ACQUISITION_STATUSES',
        url: '/settings/acquisition-statuses',
        permissions: permissions.HIERARCHY.GET_ACQUISITION_STATUSES,
      },
    ],
  },
];

export const sidebarBottomMenu: Array<SidebarMenuItem> = [{
  label: 'SIDEBAR.BOTTOM_MENU.RELEASE_NOTES',
  icon: 'icon-support',
  url: '/release-notes',
}];

type TabItem = {
  label: string,
  url: string,
  permissions?: string,
};

export const operatorTabs = (isSales: boolean): Array<TabItem> => {
  const tabs = [
    {
      label: 'OPERATOR_PROFILE.TABS.PROFILE',
      url: '/operators/:id/profile',
    },
    {
      label: 'OPERATOR_PROFILE.TABS.FEED',
      url: '/operators/:id/feed',
      permissions: permissions.AUDIT.AUDIT_LOGS,
    },
  ];

  // Check if operator profile userType is SALES to show sales rules tab
  if (isSales) {
    tabs.push({
      label: 'OPERATOR_PROFILE.TABS.SALES_RULES',
      url: '/operators/:id/sales-rules',
      permissions: permissions.SALES_RULES.GET_RULES,
    });
  }

  return tabs;
};

export const partnerTabs: Array<TabItem> = [
  {
    label: 'PARTNER_PROFILE.TABS.PROFILE',
    url: '/partners/:id/profile',
  },
  {
    label: 'PARTNER_PROFILE.TABS.SALES_RULES',
    url: '/partners/:id/sales-rules',
    permissions: permissions.SALES_RULES.GET_RULES,
  },
  {
    label: 'PARTNER_PROFILE.TABS.FEED',
    url: '/partners/:id/feed',
    permissions: permissions.AUDIT.AUDIT_LOGS,
  },
];

export const distributionRuleTabs = (isManual: boolean): Array<TabItem> => {
  const tabs = [
    {
      label: 'CLIENTS_DISTRIBUTION.RULE.GENERAL_INFO',
      url: '/distribution/:id/rule/general',
    },
    {
      label: 'CLIENTS_DISTRIBUTION.RULE.FEED',
      url: '/distribution/:id/rule/feed',
      permissions: permissions.AUDIT.AUDIT_LOGS,
    },
  ];

  // Check if ruleDistribution executionType is MANUAL to show shedule settings tab
  if (isManual) {
    tabs.push({
      label: 'CLIENTS_DISTRIBUTION.RULE.SCHEDULE_SETTINGS',
      url: '/distribution/:id/rule/schedule',
    });
  }

  return tabs;
};
