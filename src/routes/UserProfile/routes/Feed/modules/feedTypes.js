import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';

const KEY = 'user/feed/feed-types';
const FETCH_FEED_TYPES = createRequestAction(`${KEY}/fetch-feed-types`);

function fetchFeedTypes(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/audit/audit/logs/${playerUUID}/types`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_FEED_TYPES.REQUEST,
          FETCH_FEED_TYPES.SUCCESS,
          FETCH_FEED_TYPES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_FEED_TYPES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_FEED_TYPES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: Object.keys(payload),
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_FEED_TYPES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const actionTypes = {
  FETCH_FEED_TYPES,
};
const actionCreators = {
  fetchFeedTypes,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
