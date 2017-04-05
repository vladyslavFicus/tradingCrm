import createReducer from '../../utils/createReducer';

const KEY = 'user-panels';
const ADD = `${KEY}/add`;
const REMOVE = `${KEY}/remove`;
const SET_ACTIVE = `${KEY}/set-active`;
const RESET = `${KEY}/reset`;

function add(panel) {
  return {
    type: ADD,
    payload: panel,
  };
}

function remove(panel) {
  return {
    type: REMOVE,
    payload: panel,
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
    activeIndex: action.payload,
  }),
  [ADD]: (state, action) => {
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
        action.payload,
      ],
    };
    newState.activeIndex = newState.items.length - 1;

    return newState;
  },
  [REMOVE]: (state, action) => {
    if (!state[action.payload]) {
      return state;
    }

    const newState = [...state];
    newState.splice(action.payload, 1);

    return newState;
  },
  [RESET]: () => ({ ...initialState }),
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
