import { CALL_API } from 'redux-api-middleware';
import { CALL_GRAYLOG } from 'redux/middlewares/graylog';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'user/game-activity';
const FETCH_ACTIVITY = createRequestAction(`${KEY}/fetch-activity`);
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);

const CLIENT_METHOD_ABSOLUTE = 'searchAbsolute';
const CLIENT_METHOD_RELATIVE = 'searchRelative';
export const ITEMS_PER_PAGE = 10;
const fields = [
  '@class',
  'amountWin',
  'balance',
  'gameId',
  'gameProviderId',
  'gameRoundId',
  'gameSessionUUID',
  'gameType',
  'name',
  'playerIpAddress',
  'playerUUID',
  'stake',
  'streams',
].join();

const mapMessage = ({ providers, games, actions }) => item => ({
  name: actions[item.message.name],
  gameId: games[item.message.gameId],
  gameProviderId: providers[item.message.gameProviderId],
  gameSessionUUID: item.message.gameSessionUUID,
  playerIpAddress: item.message.playerIpAddress,
  timestamp: item.message.timestamp,
  balance: item.message.balance,
  amountWin: item.message.amountWin,
  stake: item.message.stake,
});

const buildQueryCriteria = (params) => ({
  query: Object
    .keys(params).filter(value =>
      params[value] !== '' &&
      value !== 'startDate'
      && value !== 'endDate'
    )
    .map(key => `${key}:${params[key]}`)
    .join(' AND '),
});

const buildPaginationCriteria = (page) => ({
  limit: ITEMS_PER_PAGE,
  offset: page * ITEMS_PER_PAGE,
});

const buildDateCriteria = (params) => (
  params.startDate && params.startDate ?
    { from: `${params.startDate} 00:00:00`, to: `${params.endDate} 23:59:59` } :
    { range: 0 }
);

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

function fetchGameActivity(params, page) {
  return dispatch => {
    const method = params.startDate && params.startDate ?
      CLIENT_METHOD_ABSOLUTE :
      CLIENT_METHOD_RELATIVE;

    return dispatch({
      [CALL_GRAYLOG]: {
        method,
        parameters: {
          ...buildQueryCriteria(params),
          ...buildPaginationCriteria(page),
          ...buildDateCriteria(params),
          fields,
        },
        types: [
          {
            type: FETCH_ACTIVITY.REQUEST,
            meta: {
              filters: { ...params, page },
            },
          },
          FETCH_ACTIVITY.SUCCESS,
          FETCH_ACTIVITY.FAILURE,
        ],
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
    items: action.payload.messages ? action.payload.messages.map(mapMessage(state)) : [],
    totalItems: action.payload.messages ? action.payload.total_results : 0,
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
    games: action.payload.reduce((res, game) => ({
      ...res, [game.gameId]: game.fullGameName,
    }), {}),
  }),
};

const initialState = {
  items: [],
  games: {},
  actions: {
    StopGameSessionEvent: 'Stop Game',
    StartGameSessionEvent: 'Start Game',
    BetPlacedEvent: 'Bet',
    WinCollectedEvent: 'Win',
  },
  providers: {
    stakelogic: 'Stakelogic',
  },
  totalItems: null,
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
