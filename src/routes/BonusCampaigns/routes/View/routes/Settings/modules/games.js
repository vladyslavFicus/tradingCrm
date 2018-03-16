import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import parseNumbersRange from '../../../../../../../utils/parseNumbersRange';

const KEY = 'bonus-campaign/view/settings';
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);

function fetchGames() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/game_info/public/games?${buildQueryString({ size: 9999, withLines: true })}`,
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
  games: [],
  isLoading: false,
  error: null,
  receivedAt: null,
};

const actionHandlers = {
  [FETCH_GAMES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_GAMES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    games: payload.content.map(game => ({
      ...game,
      lines: game.lines ? parseNumbersRange(game.lines) : [],
      coins: game.coins ? parseNumbersRange(game.coins) : [],
      coinSizes: game.coinSizes ? parseNumbersRange(game.coinSizes) : [],
      betLevels: game.betLevel ? parseNumbersRange(game.betLevel) : [],
      coinValueLevels: game.coinValueLevel ? parseNumbersRange(game.coinValueLevel) : [],
    })),
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_GAMES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
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