import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'user/game-activity';
const FETCH_ACTIVITY = createRequestAction(`${KEY}/fetch-activity`);
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);

const mapGames = (items) => items.reduce((result, item) => ({
  ...result,
  [item.gameId]: item.fullGameName,
}), {});

function fetchGames() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/game_info/game/list?${buildQueryString({ limit: 9999 })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [FETCH_GAMES.REQUEST, FETCH_GAMES.SUCCESS, FETCH_GAMES.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function fetchGameActivity(playerUUID, filters = { page: 0 }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing-session/gaming-activity/${playerUUID}?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_ACTIVITY.REQUEST,
            meta: { filters },
          },
          FETCH_ACTIVITY.SUCCESS,
          FETCH_ACTIVITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ACTIVITY.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_ACTIVITY.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ACTIVITY.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),

  [FETCH_GAMES.SUCCESS]: (state, action) => ({
    ...state,
    games: mapGames(action.payload),
  }),
};

const initialState = {
  entities: {
    first: null,
    last: null,
    number: null,
    numberOfElements: null,
    size: null,
    sort: null,
    totalElements: null,
    totalPages: null,
    content: [],
  },
  games: {},
  providers: {
    stakelogic: 'Stakelogic',
    netent: 'Netent',
  },
  filters: {},
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};

function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_ACTIVITY,
  FETCH_GAMES,
};
const actionCreators = {
  fetchGameActivity,
  fetchGames,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
