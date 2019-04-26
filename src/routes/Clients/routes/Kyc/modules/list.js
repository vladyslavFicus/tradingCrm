import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../utils/buildQueryString';

const KEY = 'kyc-requests';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const RESET = `${KEY}/reset`;

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/requests?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          {
            type: FETCH_ENTITIES.REQUEST,
            meta: { ...filters },
          },
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function reset() {
  return {
    type: RESET,
  };
}

const initialState = {
  entities: {
    first: null,
    last: null,
    number: null,
    numberOfElements: null,
    size: null,
    sort: null,
    totalElements: null,
    totalPages: null,
    content: [],
  },
  filters: {},
  isLoading: false,
  error: null,
  receivedAt: null,
  exporting: false,
  noResults: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
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
  [RESET]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  RESET,
};
const actionCreators = {
  fetchEntities,
  reset,
};

export {
  actionCreators,
  actionTypes,
  initialState,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
