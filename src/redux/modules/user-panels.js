import { actionTypes as locationActionTypes } from './location';
import createReducer from '../../utils/createReducer';
import { actionTypes as windowActionTypes } from '../modules/window';
import { actionTypes as authActionTypes } from './auth';

const PROFILE_ROUTE_PREFIX = 'users';
const profilePathnameRegExp = new RegExp(`^\\/${PROFILE_ROUTE_PREFIX}\\/([^\\/]+)\\/?.*`, 'i');

const KEY = 'user-panels';
const ADD = `${KEY}/add`;
const REMOVE = `${KEY}/remove`;
const SET_ACTIVE = `${KEY}/set-active`;
const RESET = `${KEY}/reset`;

function getColor(usedColors, colors = ['orange', 'green', 'purple', 'blue', 'pink']) {
  if (!Array.isArray(colors) || !colors.length) {
    throw new Error('No available colors');
  }

  const usage = usedColors
    .reduce((res, item) => {
      const index = res.findIndex(c => c.color === item);
      if (index > -1) {
        const next = [...res];
        next[index].count += 1;

        return next;
      }

      return res;
    }, colors.map(c => ({ color: c, count: 0 })))
    .sort((a, b) => a.count - b.count);

  return usage[0].color;
}

function add(panel) {
  return {
    type: ADD,
    payload: panel,
  };
}

function remove(index) {
  return {
    type: REMOVE,
    payload: index,
  };
}

function setActive(index) {
  return {
    type: SET_ACTIVE,
    payload: index,
  };
}

function reset() {
  return {
    type: RESET,
  };
}

const initialState = {
  items: [],
  activeIndex: null,
};
const actionHandlers = {
  [SET_ACTIVE]: (state, action) => ({
    ...state,
    activeIndex: state.activeIndex !== action.payload ? action.payload : null,
  }),
  [ADD]: (state, action) => {
    if (state.items.length >= 5) {
      return state;
    }

    const existIndex = state.items.findIndex(item => item.uuid === action.payload.uuid);

    if (existIndex > -1) {
      const newState = { ...state, activeIndex: existIndex };
      if (action.payload.path && newState.items[existIndex].path !== action.payload.path) {
        newState.items[existIndex].path = action.payload.path;
      }

      return newState;
    }

    const newState = {
      ...state,
      items: [
        ...state.items,
        {
          ...action.payload,
          color: getColor(state.items.map(i => i.color)),
          path: action.payload.path || 'profile',
        },
      ],
    };
    newState.activeIndex = newState.items.length - 1;

    return newState;
  },
  [REMOVE]: (state, action) => {
    if (!state.items[action.payload]) {
      return state;
    }

    const newState = { ...state, items: [...state.items] };
    newState.items.splice(action.payload, 1);

    if (newState.activeIndex === action.payload) {
      newState.activeIndex = null;
    } else {
      newState.activeIndex = newState.items.indexOf(state.items[state.activeIndex]);
    }

    return newState;
  },
  [RESET]: () => ({ ...initialState }),
  [windowActionTypes.VIEW_PLAYER_PROFILE]: (state, action) => {
    const { uuid, firstName, lastName, username: login } = action.payload;

    const index = state.items.findIndex(item => item.uuid === uuid);

    if (index === -1) {
      return state;
    }

    const fullName = `${firstName || '-'} ${lastName || '-'}`;
    const newState = {
      ...state,
      items: [...state.items],
    };

    const newItem = {
      ...state.items[index],
      fullName,
    };

    if (login) {
      newItem.login = login;
    }

    newState.items[index] = newItem;

    return newState;
  },
  [windowActionTypes.CLOSE_PROFILE_TAB]: (state, action) => {
    const currentUserTabUuid = action.payload;
    const currentUserTabIndex = state.items.findIndex(tab => tab.uuid === currentUserTabUuid);

    if (!state.items[currentUserTabIndex]) {
      return state;
    }

    const newState = { ...state, items: [...state.items] };

    newState.items.splice(currentUserTabIndex, 1);

    if (newState.activeIndex === currentUserTabIndex) {
      newState.activeIndex = null;
    } else {
      newState.activeIndex = newState.items.indexOf(state.items[state.activeIndex]);
    }

    return newState;
  },
  [authActionTypes.LOGOUT.SUCCESS]: () => ({ ...initialState }),
};

if (window && window === window.parent) {
  actionHandlers[locationActionTypes.LOCATION_CHANGE] = (state, action) => {
    if (action.payload && action.payload.state && action.payload.state.ignoreByUsersPanel) {
      return state;
    }

    return { ...state, activeIndex: null };
  };
} else {
  actionHandlers[locationActionTypes.LOCATION_CHANGE] = (state, action) => {
    const { pathname } = action.payload;
    const [, playerUUID] = pathname.match(profilePathnameRegExp);

    if (!playerUUID) {
      return state;
    }

    const playerIndex = state.items.findIndex(item => item.uuid === playerUUID);

    if (playerIndex === -1) {
      return state;
    }

    const newState = { ...state, items: [...state.items] };

    newState.items[playerIndex] = {
      ...state.items[playerIndex],
      path: pathname.replace(`/${PROFILE_ROUTE_PREFIX}/${playerUUID}/`, ''),
    };

    return newState;
  };
}
const actionTypes = {
  ADD,
  REMOVE,
  RESET,
  SET_ACTIVE,
};
const actionCreators = {
  add,
  remove,
  reset,
  setActive,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
