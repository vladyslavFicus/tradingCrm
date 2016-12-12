import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import createRequestAction from 'utils/createRequestAction';
import GraylogClient from 'nas-graylog-api';

const client = new GraylogClient({
  auth: 'Basic ' + btoa('admin:admin'),
  port: 80,
  host: 'graylog.app',
  basePath: '/api',
});

const KEY = 'user/game-activity';
const FETCH_ACTIVITY = createRequestAction(`${KEY}/fetch-activity`);
const FETCH_GAMES = createRequestAction(`${KEY}/fetch-games`);

const CLIENT_METHOD_ABSOLUTE = 'searchAbsolute';
const CLIENT_METHOD_RELATIVE = 'searchRelative';
export const ITEMS_PER_PAGE = 10;

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
  return (dispatch, getState) => {
    const {
      userGameActivity : { allGames, allActions, allProviders },
    } = getState();

    const method = params.startDate && params.startDate ?
      CLIENT_METHOD_ABSOLUTE :
      CLIENT_METHOD_RELATIVE;

    dispatch({ type: FETCH_ACTIVITY.REQUEST, meta: { filters: { ...params, page } } });
    return client[method]({
      ...buildQueryCriteria(params),
      ...buildPaginationCriteria(page),
      ...buildDateCriteria(params),
      fields: [
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
      ].join(),
    })
      .then(
        response => dispatch({
          type: FETCH_ACTIVITY.SUCCESS,
          payload: {
            items: response.messages.map(elem => ({
              name: allActions[elem.message.name],
              gameId: allGames[elem.message.gameId],
              gameProviderId: allProviders[elem.message.gameProviderId],
              gameSessionUUID: elem.message.gameSessionUUID,
              playerIpAddress: elem.message.playerIpAddress,
              timestamp: elem.message.timestamp,
              balance: elem.message.balance,
              amountWin: elem.message.amountWin,
              stake: elem.message.stake,
            })),
            totalItems: response.total_results,
          },
        }),
        error => dispatch({ type: FETCH_ACTIVITY.FAILURE, error: true, payload: error })
      );
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
    ...action.payload,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ACTIVITY.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),

  [FETCH_GAMES.SUCCESS]: (state, action) => {
    const allGames = {};
    action.payload.forEach((game) => {
      allGames[game.gameId] = game.fullGameName;
    });

    return { ...state, allGames };
  },
};

const initialState = {
  items: [],
  allGames: [],
  allActions: {
    StopGameSessionEvent: 'Stop Game',
    StartGameSessionEvent: 'Start Game',
    BetPlacedEvent: 'Bet',
    WinCollectedEvent: 'Win',
  },
  allProviders: {
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
