import createReducer from '../../utils/createReducer';
import Permissions, { CONDITIONS } from '../../utils/permissions';
import permission from '../../config/permissions';
import I18n from '../../utils/fake-i18n';
import { actionTypes as windowActionTypes } from './window';

const KEY = 'app';
const SET_SCROLL_TO_TOP = `${KEY}/set-scroll-to-top`;
const TOGGLE_MENU_TAP = `${KEY}/toggle-menu-tap`;
const MENU_CLICK = `${KEY}/menu-click`;

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
      label: I18n.t('SIDEBAR.TOP_MENU.PAYMENTS'),
      icon: 'fa fa-credit-card',
      isOpen: false,
      items: [
        { label: I18n.t('SIDEBAR.TOP_MENU.TRANSACTIONS'), url: '/transactions' },
        { label: I18n.t('SIDEBAR.TOP_MENU.PAYMENT_METHODS'), url: '/paymentMethods' },
      ],
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.BONUS_CAMPAIGNS'),
      icon: 'fa fa-gift',
      url: '/bonus-campaigns',
    },
    {
      label: 'MGA',
      icon: 'fa fa-pie-chart',
      isOpen: false,
      items: [
        {
          label: I18n.t('SIDEBAR.TOP_MENU.PLAYER_LIABILITY'),
          url: '/reports/player-liability',
          permissions: new Permissions([
            permission.REPORTS.PLAYER_LIABILITY_VIEW,
            permission.REPORTS.PLAYER_LIABILITY_FILE_VIEW,
            permission.REPORTS.PLAYER_LIABILITY_FILES_VIEW,
          ], CONDITIONS.OR),
        },
        {
          label: I18n.t('SIDEBAR.TOP_MENU.REVENUE'),
          url: '/reports/revenue',
          permissions: new Permissions([permission.REPORTS.VAT_VIEW]),
        },
        {
          label: I18n.t('SIDEBAR.TOP_MENU.DORMANT'),
          url: '/users/dormant',
        },
        {
          label: I18n.t('SIDEBAR.TOP_MENU.OPEN_LOOP'),
          url: '/transactions/open-loops',
        },
      ],
    },
    {
      label: I18n.t('SIDEBAR.TOP_MENU.GAMES'),
      icon: 'fa fa-gamepad',
      url: '/games',
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

function toggleMenuTap(index) {
  return {
    type: TOGGLE_MENU_TAP,
    payload: index,
  };
}

function menuClick() {
  return {
    type: MENU_CLICK,
  };
}

const actionCreators = {
  setIsShowScrollTop,
  toggleMenuTap,
  menuClick,
};

const actionTypes = {
  SET_SCROLL_TO_TOP,
  TOGGLE_MENU_TAP,
  MENU_CLICK,
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
  [TOGGLE_MENU_TAP]: (state, action) => {
    const newSidebarTopMenu = [ ...state.sidebarTopMenu ];
    const index = action.payload;

    return {
      ...state,
      sidebarTopMenu: newSidebarTopMenu.map((menuItem, menuItemIndex) => {
        if (menuItemIndex !== index) {
          menuItem.isOpen = false;
        }

        if (menuItemIndex === index) {
          menuItem.isOpen = !menuItem.isOpen;
        }

        return menuItem;
      }),
    };
  },
  [MENU_CLICK]: (state, action) => ({
    ...state,
    sidebarTopMenu: state.sidebarTopMenu.map((menuItem) => {
      if (menuItem.items) {
        menuItem.isOpen = false;
      }

      return menuItem;
    }),
  }),
};

export {
  actionCreators,
  actionHandlers,
  actionTypes,
};

export default createReducer(initialState, actionHandlers);
