import createReducer from '../../utils/createReducer';
import I18n from '../../utils/fake-i18n';
import { actionTypes as windowActionTypes } from './window';

const KEY = 'app';
const SET_SCROLL_TO_TOP = `${KEY}/set-scroll-to-top`;
const TOGGLE_MENU_TAB = `${KEY}/toggle-menu-tab`;
const MENU_ITEM_CLICK = `${KEY}/menu-item-click`;

const initialState = {
  showScrollToTop: false,
  isInitializedScroll: false,
  sidebarTopMenu: [
    {
      label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS'),
      icon: 'fa fa-users',
      isOpen: false,
      items: [
        { label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS_SEARCH'), url: '/users/list' },
        { label: I18n.t('SIDEBAR.TOP_MENU.PLAYERS_KYC_REQUEST'), url: '/users/kyc-requests' },
      ],
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.OPERATORS'),
      icon: 'fa fa-eye',
      url: '/operators/list',
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.TRANSACTIONS'),
      icon: 'fa fa-credit-card',
      isOpen: false,
      items: [
        { label: I18n.t('SIDEBAR.TOP_MENU.PAYMENTS'), url: '/transactions/list' },
        { label: I18n.t('SIDEBAR.TOP_MENU.OPEN_LOOP'), url: '/transactions/open-loops' },
      ],
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.BONUS_CAMPAIGNS'),
      icon: 'fa fa-gift',
      url: '/bonus-campaigns',
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.SETTINGS'),
      icon: 'fa fa-gear',
      isOpen: false,
      items: [
        { label: I18n.t('SIDEBAR.TOP_MENU.GAMES'), url: '/settings/games' },
        { label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'), url: '/settings/paymentMethods' },
      ],
    },
  ],
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

const actionCreators = {
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
        isOpen: menuItemIndex !== index ? false : !menuItem.isOpen,
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
