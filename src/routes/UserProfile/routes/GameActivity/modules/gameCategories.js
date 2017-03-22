import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';

const KEY = 'user/game-activity/game-categories';
const FETCH_GAME_CATEGORIES = createRequestAction(`${KEY}/fetch-game-categories`);

function fetchGameCategories() {
  return {
    [CALL_API]: {
      endpoint: '/game_info/public/categories',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_GAME_CATEGORIES.REQUEST,
        FETCH_GAME_CATEGORIES.SUCCESS,
        FETCH_GAME_CATEGORIES.FAILURE,
      ],
    },
  };
}

const initialState = {
  entities: {},
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_GAME_CATEGORIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_GAME_CATEGORIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: action.payload.reduce((result, item) => ({ ...result, [item]: item }), {}),
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_GAME_CATEGORIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const actionTypes = {
  FETCH_GAME_CATEGORIES,
};
const actionCreators = {
  fetchGameCategories,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
