import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../../../../../utils/buildQueryString';

const KEY = 'player/bonus-campaign/list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);

function fetchPlayerCampaigns({playerUUID, ...filters}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!playerUUID) {
      throw new Error('playerUUID not defined');
    }

    const queryParams = { ...filters, sort: 'startDate,desc' };

    return dispatch({
      [CALL_API]: {
        endpoint: `campaign_aggregator/eligible/${playerUUID}?${buildQueryString(queryParams)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? payload.content
        : [
          ...state.entities.content,
          ...payload.content,
        ],
    },
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.content.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchPlayerCampaigns,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
