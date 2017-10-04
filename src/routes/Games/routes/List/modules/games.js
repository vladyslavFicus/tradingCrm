import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import createReducer from '../../../../../utils/createReducer';

const KEY = 'games/list/games';
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);
const RESET_SERVER_GAMES = createRequestAction(`${KEY}/reset-server-games`);
const RESET_GAMES = `${KEY}/reset-games`;

const mergeEntities = (stored, fetched) => {
  const merged = [...stored];

  fetched.forEach((item) => {
    if (merged.findIndex(i => i.gameId === item.gameId) === -1) {
      merged.push(item);
    }
  });

  return merged;
};

function fetchGames(filters = {}) {
  return {
    [CALL_API]: {
      endpoint: `game_info/public/games?${buildQueryString({ page: 0, ...filters })}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_GAMES.REQUEST,
        FETCH_GAMES.SUCCESS,
        FETCH_GAMES.FAILURE,
      ],
    },
  };
}

function resetServerGames() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'game_info/public/games/reset',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          RESET_SERVER_GAMES.REQUEST,
          RESET_SERVER_GAMES.SUCCESS,
          RESET_SERVER_GAMES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function resetGames() {
  return {
    type: RESET_GAMES,
  };
}

const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: [],
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionHandlers = {
  [FETCH_GAMES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_GAMES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.number === 0
        ? action.payload.content
        : mergeEntities(state.entities.content, action.payload.content),
    },
    isLoading: false,
    receivedAt: timestamp(),
    noResults: action.payload.content.length === 0,
  }),
  [FETCH_GAMES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [RESET_GAMES]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_GAMES,
  RESET_SERVER_GAMES,
  RESET_GAMES,
};
const actionCreators = {
  fetchGames,
  resetServerGames,
  resetGames,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
