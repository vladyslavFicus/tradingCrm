import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';

const KEY = 'user/game-activity/games';
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);

const mapGames = items => items.reduce((result, item) => ({
  ...result,
  [item.gameId]: item.fullGameName,
}), {});

function fetchGames() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/game_info/public/games?${buildQueryString({ limit: 9999 })}`,
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

const initialState = {
  entities: {},
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_GAMES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_GAMES.SUCCESS]: (state, action) => ({
    ...state,
    entities: mapGames(action.payload),
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_GAMES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const actionTypes = {
  FETCH_GAMES,
};
const actionCreators = {
  fetchGames,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
