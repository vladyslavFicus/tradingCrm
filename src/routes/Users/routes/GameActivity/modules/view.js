import { getTimestamp } from 'utils/helpers';
import GraylogClient from 'nas-graylog-api';

const client = new GraylogClient({
  auth: 'Basic ' + btoa('admin:admin'),
  port: 80,
  host: 'graylog.app',
  basePath: '/api',
});
console.log(client);
const KEY = 'user/game-activity';
const FETCH_ACTIVITY_REQUEST = `${KEY}/fetch-activity-request`;
const FETCH_ACTIVITY_SUCCESS = `${KEY}/fetch-activity-success`;
const FETCH_ACTIVITY_FAILURE = `${KEY}/fetch-activity-failure`;

function fetchGameActivity() {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    dispatch({ type: FETCH_ACTIVITY_REQUEST });
    return client.searchAbsolute({
      query: 'gl2_source_input:584569002ab79c0001f8cc64',
      from: '2016-12-05 00:00:00',
      to: '2016-12-06 23:59:59',
      limit: 10,
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
        response => dispatch({ type: FETCH_ACTIVITY_SUCCESS, payload: response.messages }),
        error => dispatch({ type: FETCH_ACTIVITY_FAILURE, error: true, payload: error })
      );
  };
}

const actionHandlers = {
  [FETCH_ACTIVITY_REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_ACTIVITY_SUCCESS]: (state, action) => ({
    ...state,
    items: action.payload,
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [FETCH_ACTIVITY_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  item: [],
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
  FETCH_ACTIVITY_REQUEST,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_ACTIVITY_FAILURE,
};

const actionCreators = {
  fetchGameActivity,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
