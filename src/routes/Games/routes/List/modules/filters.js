import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';

const KEY = 'games/categories';
const FETCH_CATEGORIES = createRequestAction(`${KEY}/fetch-categories`);

function fetchCategories() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: '/game_info/public/categories',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_CATEGORIES.REQUEST,
          FETCH_CATEGORIES.SUCCESS,
          FETCH_CATEGORIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: {
    categories: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_CATEGORIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_CATEGORIES.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      categories: action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_CATEGORIES.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
    receivedAt: timestamp(),
  }),
};
const actionTypes = {
  FETCH_CATEGORIES,
};
const actionCreators = {
  fetchCategories,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
