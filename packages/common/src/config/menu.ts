import keyMirror from 'keymirror';
import permissions from './permissions';

const CONDITIONS = keyMirror({
  OR: null,
  AND: null,
});

export type SidebarMenuSubItem = {
  label: string,
  url: string,
  permissions?: Array<string>,
  icon?: string,
  conditions?: string,
};

export type SidebarMenuItem = {
  label: string,
  icon: string,
  url?: string,
  conditions?: string,
  permissions?: Array<string>,
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
        permissions: [
          permissions.USER_PROFILE.PROFILES_LIST,
          permissions.SIDEBAR.CLIENTS_LIST,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.KYC_DOCUMENTS',
        url: '/clients/kyc-documents',
        permissions: [
          permissions.FILES.SEARCH_FILES,
          permissions.SIDEBAR.CLIENTS_KYC_DOCUMENTS,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ACCOUNTS',
        url: '/trading-accounts',
        permissions: [
          permissions.TRADING_ACCOUNTS.GET_TRADING_ACCOUNTS,
          permissions.SIDEBAR.CLIENTS_TRADING_ACCOUNTS,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.CLIENT_CALLBACKS',
        url: '/clients/callbacks',
        permissions: [
          permissions.USER_PROFILE.CALLBACKS_LIST,
          permissions.SIDEBAR.CLIENTS_CALLBACKS,
        ],
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
        permissions: [
          permissions.LEADS.GET_LEADS,
          permissions.SIDEBAR.LEADS_LIST,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.LEAD_CALLBACKS',
        url: '/leads/callbacks',
        permissions: [
          permissions.LEAD_PROFILE.CALLBACKS_LIST,
          permissions.SIDEBAR.LEADS_CALLBACKS,
        ],
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.HIERARCHY',
    icon: 'icon-organization',
    url: '/hierarchy',
    permissions: [
      permissions.HIERARCHY.GET_TREE,
      permissions.SIDEBAR.HIERARCHY,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.MANAGEMENT',
    icon: 'icon-operators SidebarNavItem__icon--operators',
    isOpen: false,
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.OFFICES',
        url: '/offices',
        permissions: [
          permissions.HIERARCHY.GET_OFFICES,
          permissions.SIDEBAR.MANAGMENT_OFFICES,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.DESKS',
        url: '/desks',
        permissions: [
          permissions.HIERARCHY.GET_DESKS,
          permissions.SIDEBAR.MANAGMENT_DESKS,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TEAMS',
        url: '/teams',
        permissions: [
          permissions.HIERARCHY.GET_TEAMS,
          permissions.SIDEBAR.MANAGMENT_TEAMS,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.SALES_RULES',
        url: '/sales-rules',
        permissions: [
          permissions.SALES_RULES.GET_RULES,
          permissions.SIDEBAR.MANAGMENT_SALES_RULES,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.OPERATORS',
        url: '/operators',
        permissions: [
          permissions.HIERARCHY.GET_OPERATORS,
          permissions.SIDEBAR.MANAGMENT_OPERATORS,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.PARTNERS',
        url: '/partners',
        permissions: [
          permissions.PARTNERS.PARTNERS_LIST_VIEW,
          permissions.SIDEBAR.MANAGMENT_PARTNERS,
        ],
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.DOCUMENTS',
    icon: 'icon-file-text2',
    url: '/documents',
    permissions: [
      permissions.DOCUMENTS.SEARCH_DOCUMENT,
      permissions.SIDEBAR.DOCUMENTS,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.PAYMENTS',
    icon: 'icon-payments SidebarNavItem__icon--payments',
    url: '/payments',
    permissions: [
      permissions.PAYMENTS.PAYMENTS_LIST,
      permissions.SIDEBAR.PAYMENTS,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.NOTIFICATIONS',
    icon: 'icon-notifications',
    url: '/notifications',
    permissions: [
      permissions.NOTIFICATION_CENTER.LIST,
      permissions.SIDEBAR.NOTIFICATIONS,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.CLIENTS_DISTRIBUTION',
    icon: 'icon-union',
    url: '/distribution',
    permissions: [
      permissions.CLIENTS_DISTRIBUTION.LIST,
      permissions.SIDEBAR.CLIENTS_DISTIBUTION,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.TITLE',
    icon: 'icon-trading-engine',
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.ACCOUNTS',
        url: '/trading-engine/accounts',
        permissions: [permissions.WE_TRADING.ACCOUNTS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.ORDERS',
        url: '/trading-engine/orders',
        permissions: [permissions.WE_TRADING.ORDERS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.QUOTES',
        url: '/trading-engine/quotes',
        permissions: [permissions.WE_TRADING.SYMBOLS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.MARGIN_CALLS',
        url: '/trading-engine/margin-calls',
        permissions: [permissions.WE_TRADING.ACCOUNTS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.SYMBOLS',
        url: '/trading-engine/symbols',
        permissions: [permissions.WE_TRADING.SYMBOLS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.GROUPS',
        url: '/trading-engine/groups',
        permissions: [permissions.WE_TRADING.GROUPS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.SECURITIES',
        url: '/trading-engine/securities',
        permissions: [permissions.WE_TRADING.SECURITIES_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.HOLIDAYS',
        url: '/trading-engine/holidays',
        permissions: [permissions.WE_TRADING.HOLIDAYS_LIST],
      },
      {
        label: 'SIDEBAR.TOP_MENU.TRADING_ENGINE.OPERATORS',
        url: '/trading-engine/operators',
        permissions: [permissions.WE_TRADING.OPERATORS_LIST],
      },
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.IP_WHITELIST',
    icon: 'icon-ip-whitelist',
    url: '/ip-whitelist',
    permissions: [
      permissions.IP_WHITELIST.LIST,
      permissions.SIDEBAR.IP_WHITELIST,
    ],
  },
  {
    label: 'SIDEBAR.TOP_MENU.SETTINGS.TITLE',
    icon: 'icon-settings',
    isOpen: false,
    items: [
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.EMAIL_TEMPLATES',
        url: '/email-templates',
        permissions: [
          permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE,
          permissions.SIDEBAR.SETTINGS_EMAIL_TEMPLATES,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.ROLES_AND_PERMISSIONS',
        url: '/roles-and-permissions',
        permissions: [
          permissions.AUTH.UPDATE_ACTIONS,
          permissions.SIDEBAR.SETTINGS_RBAC,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.ACQUISITION_STATUSES',
        url: '/acquisition-statuses',
        permissions: [
          permissions.HIERARCHY.GET_ACQUISITION_STATUSES,
          permissions.SIDEBAR.SETTINGS_ACQUISITION_STATUSES,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.FEATURE_TOGGLES',
        url: '/feature-toggles',
        permissions: [
          permissions.BRAND_CONFIG.GET_BRAND_CONFIG,
          permissions.SIDEBAR.SETTINGS_FEATURE_TOGGLES,
        ],
      },
      {
        label: 'SIDEBAR.TOP_MENU.SETTINGS.PSP',
        url: '/psp',
        permissions: [
          permissions.PAYMENT.SEARCH_PSP,
          permissions.SIDEBAR.SETTINGS_PAYMENT_SYSTEMS_PROVIDER,
        ],
      },
    ],
  },
];

export const sidebarBottomMenu: Array<SidebarMenuItem> = [{
  label: 'SIDEBAR.BOTTOM_MENU.RELEASE_NOTES',
  icon: 'icon-support',
  url: '/release-notes',
}];
