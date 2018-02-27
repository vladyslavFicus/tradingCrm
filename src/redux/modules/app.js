import createReducer from '../../utils/createReducer';
import I18n from '../../utils/fake-i18n';
import { actionTypes as windowActionTypes } from './window';
import Permissions from '../../utils/permissions';
import permissions from '../../config/permissions';

const KEY = 'app';
const SET_SCROLL_TO_TOP = `${KEY}/set-scroll-to-top`;
const TOGGLE_MENU_TAB = `${KEY}/toggle-menu-tab`;
const MENU_ITEM_CLICK = `${KEY}/menu-item-click`;
const INIT_SIDEBAR = `${KEY}/init-sidebar`;

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
        permissions: new Permissions(permissions.GAME_INFO.GAME_LIST),
      },
      {
        label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'),
        url: '/settings/paymentMethods',
        permissions: new Permissions(permissions.PAYMENT.PAYMENT_METHODS_LIST),
      },
    ],
  },
];

const initialState = {
  showScrollToTop: false,
  isInitializedScroll: false,
  sidebarTopMenu: [],
  sidebarBottomMenu: [
    { label: I18n.t('SIDEBAR.BOTTOM_MENU.SUPPORT'), icon: 'fa fa-life-ring', url: '#' },
  ],
};

function setIsShowScrollTop(payload) {
  return {
    type: SET_SCROLL_TO_TOP,
    payload,
  };
}

function toggleMenuTab(index) {
  return {
    type: TOGGLE_MENU_TAB,
    payload: index,
  };
}

function menuItemClick() {
  return {
    type: MENU_ITEM_CLICK,
  };
}

function initSidebar(userPermissions) {
  return {
    type: INIT_SIDEBAR,
    payload: userPermissions,
  };
}

const actionCreators = {
  initSidebar,
  setIsShowScrollTop,
  toggleMenuTab,
  menuItemClick,
};

const actionTypes = {
  SET_SCROLL_TO_TOP,
  TOGGLE_MENU_TAB,
  MENU_ITEM_CLICK,
};
const actionHandlers = {
  [INIT_SIDEBAR]: (state, { payload: currentPermissions }) => {
    const permissionMenu = sidebarTopMenu.reduce((result, item) => {
      if (!(item.permissions instanceof Permissions) || item.permissions.check(currentPermissions)) {
        result.push(item);
      } else if (item.items) {
        const subItems = item.items.filter(
          i => !(i.permissions instanceof Permissions) || i.permissions.check(currentPermissions)
        );

        if (subItems.length) {
          result.push({
            ...item,
            items: subItems,
          });
        }
      }

      return result;
    }, []);

    return {
      ...state,
      sidebarTopMenu: permissionMenu,
    };
  },
  [SET_SCROLL_TO_TOP]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload,
    isInitializedScroll: state.isInitializedScroll || action.payload,
  }),
  [windowActionTypes.SHOW_SCROLL_TO_TOP]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload,
    isInitializedScroll: state.isInitializedScroll || action.payload,
  }),
  [TOGGLE_MENU_TAB]: (state, action) => {
    const newSidebarTopMenu = [...state.sidebarTopMenu];
    const index = action.payload;

    return {
      ...state,
      sidebarTopMenu: newSidebarTopMenu.map((menuItem, menuItemIndex) => ({
        ...menuItem,
        isOpen: !(menuItemIndex !== index || menuItem.isOpen),
      })),
    };
  },
  [MENU_ITEM_CLICK]: (state) => {
    const newSidebarTopMenu = [...state.sidebarTopMenu];

    return {
      ...state,
      sidebarTopMenu: newSidebarTopMenu.map((menuItem) => {
        const { items } = menuItem;
        const isSubMenu = !!(items && items.length);

        return {
          ...menuItem,
          isOpen: isSubMenu && !!items.find(subMenuItem => subMenuItem.url === location.pathname),
        };
      }),
    };
  },
};

export {
  actionCreators,
  actionHandlers,
  actionTypes,
};

export default createReducer(initialState, actionHandlers);
