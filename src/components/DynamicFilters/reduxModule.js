import createReducer from '../../utils/createReducer';

const KEY = 'dynamicForm';
const ADD_ITEM = `${KEY}/add-item`;
const REMOVE_ITEM = `${KEY}/remove-item`;

function addItem(formName, fieldName) {
  return {
    type: ADD_ITEM,
    payload: { formName, fieldName },
  };
}

function removeItem(formName, fieldName) {
  return {
    type: REMOVE_ITEM,
    payload: { formName, fieldName },
  };
}

const initialState = {};
const actionHandlers = {
  [ADD_ITEM]: (state, action) => {
    const { formName, fieldName } = action.payload;

    if (!state[action.payload.formName]) {
      return { ...state, [formName]: [fieldName] };
    }

    if (state[formName].indexOf() === -1) {
      const filters = [...state[formName]];
      filters.push(fieldName);

      return { ...state, [formName]: filters };
    }

    return state;
  },
  [REMOVE_ITEM]: (state, action) => {
    const { formName, fieldName } = action.payload;

    if (state[formName]) {
      const index = state[formName].indexOf(fieldName);

      if (index > -1) {
        const filters = [...state[formName]];
        filters.splice(index, 1);

        const newState = { ...state };

        if (filters.length === 0) {
          delete newState[formName];
        } else {
          newState[formName] = filters;
        }

        return newState;
      }
    }

    return state;
  },
};
const actionCreators = {
  addItem,
  removeItem,
};
const actionTypes = {
  ADD_ITEM,
  REMOVE_ITEM,
};

export {
  initialState,
  actionHandlers,
  actionCreators,
  actionTypes,
};
export default createReducer(initialState, actionHandlers);
