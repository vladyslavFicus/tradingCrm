import createReducer from '../../utils/createReducer';

const ADD = 'notifications/add';
const REMOVE = 'notifications/remove';
const initialState = [];
const actionHandlers = {
  [ADD]: (state, { type, message, id }) => [
    ...state,
    { type, message, id },
  ],
  [REMOVE]: (state, { id }) => state.filter(item => item.id !== id),
};

function add() {
  return {
    type: ADD,
  };
}

function remove() {
  return {
    type: REMOVE,
  };
}

const actionTypes = {
  ADD,
  REMOVE,
};
const actionCreators = {
  add,
  remove,
};

export {
  actionCreators,
  actionTypes,
};

export default createReducer(initialState, actionHandlers);
