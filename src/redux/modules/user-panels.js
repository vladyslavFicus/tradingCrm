import createReducer from '../../utils/createReducer';

const KEY = 'user-panels';
const ADD = `${KEY}/add-panel`;
const REMOVE = `${KEY}/remove-panel`;
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

function reset() {
  return {
    type: RESET,
  };
}

const initialState = [];
const actionHandlers = {
  [ADD]: (state, action) => [
    ...state,
    action.payload,
  ],
  [REMOVE]: (state, action) => {
    if (!state[action.payload]) {
      return state;
    }

    const newState = [...state];
    newState.splice(action.payload, 1);

    return newState;
  },
  [RESET]: () => [],
};
const actionTypes = {
  ADD,
  REMOVE,
  RESET,
};
const actionCreators = {
  add,
  remove,
  reset,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
