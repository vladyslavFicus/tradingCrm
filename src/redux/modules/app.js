import createReducer from '../../utils/createReducer';
import Permissions from '../../utils/permissions';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';

const KEY = 'app';
const TOGGLE_MENU_TAB = `${KEY}/toggle-menu-tab`;
const MENU_ITEM_CLICK = `${KEY}/menu-item-click`;
const INIT_SIDEBAR = `${KEY}/init-sidebar`;

const initialState = {
  sidebarTopMenu: [],
  sidebarBottomMenu,
};

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

function initSidebar(userPermissions, authority) {
  return {
    type: INIT_SIDEBAR,
    payload: {
      userPermissions,
      authority,
    },
  };
}

const actionCreators = {
  initSidebar,
  toggleMenuTab,
  menuItemClick,
};

const actionTypes = {
  TOGGLE_MENU_TAB,
  MENU_ITEM_CLICK,
};
const actionHandlers = {
  [INIT_SIDEBAR]: (state, { payload: { userPermissions: currentPermissions, authority } }) => {
    const permissionMenu = sidebarTopMenu.reduce((result, item) => {
      if (item.items) {
        const subItems = item.items.filter((i) => {
          const isValidPermission = !(i.permissions instanceof Permissions) || i.permissions.check(currentPermissions);

          const isValidAuthorities = !(Array.isArray(i.excludeAuthorities)
            && i.excludeAuthorities.length
            && i.excludeAuthorities.some(({ department, role }) => (
              (department === authority.department) && (role === authority.role)
            )));

          return isValidPermission && isValidAuthorities;
        });

        if (subItems.length) {
          result.push({
            ...item,
            items: subItems,
          });
        }
      } else if (!(item.permissions instanceof Permissions) || item.permissions.check(currentPermissions)) {
        result.push(item);
      }

      return result;
    }, []);

    return {
      ...state,
      sidebarTopMenu: permissionMenu,
    };
  },
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
          isOpen: isSubMenu && !!items.find(subMenuItem => subMenuItem.url === window.location.pathname),
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
