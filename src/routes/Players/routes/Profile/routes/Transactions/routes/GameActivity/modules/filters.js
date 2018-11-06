import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';

const KEY = 'user/game-activity/filters';
const FETCH_FILTERS = createRequestAction(`${KEY}/fetch-filters`);

function fetchFilters(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/gaming_activity/gaming/activity/${playerUUID}/filters`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [FETCH_FILTERS.REQUEST, FETCH_FILTERS.SUCCESS, FETCH_FILTERS.FAILURE],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: {
    aggregators: [],
    providers: [],
    games: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_FILTERS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_FILTERS.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_FILTERS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const actionTypes = {
  FETCH_FILTERS,
};
const actionCreators = {
  fetchFilters,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
