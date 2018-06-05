import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../../../../../utils/buildQueryString';
import parseNumbersRange from '../../../../../../../../../utils/parseNumbersRange';
import { getBrandId } from '../../../../../../../../../config';


const KEY = 'user/bonus-free-spin/games';
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);

function fetchGames() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/game_info/public/games?${buildQueryString({ size: 9999, brandId: getBrandId(), withLines: true })}`,
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
  providers: [],
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
  [FETCH_GAMES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => {
    const { content } = payload;

    const newState = {
      ...state,
      games: Array.isArray(content) ? content.map(i => ({
        ...i,
        lines: i.lines ? parseNumbersRange(i.lines) : [],
        coins: i.coins ? parseNumbersRange(i.coins) : [],
        coinSizes: i.coinSizes ? parseNumbersRange(i.coinSizes) : [],
        betLevels: i.betLevel ? parseNumbersRange(i.betLevel) : [],
        coinValueLevels: i.coinValueLevel ? parseNumbersRange(i.coinValueLevel) : [],
      })) : [],
      isLoading: false,
      receivedAt: endRequestTime,
    };

    newState.providers = content
      .map(item => item.gameProviderId)
      .filter((value, index, self) => self.indexOf(value) === index);

    return newState;
  },
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
