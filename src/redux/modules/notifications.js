import createReducer from '../../utils/createReducer';

const ADD = 'notifications/add';
const REMOVE = 'notifications/remove';
const initialState = [];
const actionHandlers = {
  [ADD]: (state, { payload }) => [
    ...state,
    payload,
  ],
  [REMOVE]: (state, { payload: { id } }) => state.filter(item => item.id !== id),
};

function add(payload) {
  return {
    type: ADD,
    payload,
  };
}

function remove(id) {
  return {
    type: REMOVE,
    payload: {
      id,
    },
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
