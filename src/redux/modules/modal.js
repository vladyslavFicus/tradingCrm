import createReducer from '../../utils/createReducer';

const KEY = 'modals';
const OPEN = `${KEY}/open`;
const CLOSE = `${KEY}/close`;

function open(params) {
  return {
    type: OPEN,
    payload: params,
  };
}

function close() {
  return {
    type: CLOSE,
  };
}

const actionCreators = {
  open,
  close,
};

const initialState = {
  name: null,
  params: {},
};

const actionHandlers = {
  [OPEN]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  [CLOSE]: () => ({
    ...initialState,
  }),
};

const actionTypes = {
  OPEN,
  CLOSE,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
