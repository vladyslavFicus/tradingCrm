import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'user/game-activity/activity';
const FETCH_ACTIVITY = createRequestAction(`${KEY}/fetch-activity`);

function fetchGameActivity(playerUUID, filters = { page: 0 }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/gaming_activity/gaming/activity/${playerUUID}?${buildQueryString(filters)}`,
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
      ...action.payload,
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
};

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
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ACTIVITY,
};
const actionCreators = {
  fetchGameActivity,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
