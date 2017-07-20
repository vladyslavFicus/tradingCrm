import { actionTypes as locationActionTypes } from './location';
import createReducer from '../../utils/createReducer';
import { actionTypes as windowActionTypes } from '../modules/window';

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
      if (state.activeIndex !== existIndex) {
        return { ...state, activeIndex: existIndex };
      }

      return state;
    }

    const newState = {
      ...state,
      items: [
        ...state.items,
        {
          ...action.payload,
          color: getColor(state.items.map(i => i.color)),
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
      newState.activeIndex = newState.items.length > 0 || null;
    } else {
      newState.activeIndex = newState.items.indexOf(state.items[state.activeIndex]);
    }

    return newState;
  },
  [RESET]: () => ({ ...initialState }),
  [locationActionTypes.LOCATION_CHANGE]: state => ({ ...state, activeIndex: null }),
  [windowActionTypes.UPDATE_USER_TAB]: (state, action) => {
    const { uuid, firstName, lastName } = action.payload;
    const newFullName = `${firstName} ${lastName}`;

    return {
      ...state,
      items: state.items.map(item => {
        if (item.uuid === uuid && item.fullName !== newFullName) {
          item.fullName = newFullName;
        }

        return item;
      })
    };
  }
};
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
