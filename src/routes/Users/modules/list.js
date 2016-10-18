import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'users';
const FETCH_ENTITIES = createRequestTypes(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    filters = Object.keys(filters).reduce((result, key) => {
      if (filters[key]) {
        result[key] = filters[key];
      }

      return result;
    }, {});

    const endpointParams = { page: 0, ...filters };

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        endpoint: 'profile/profiles',
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      filters,
    });
  };
}

const handlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: { ...action.response, },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state, isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

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
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = handlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_ENTITIES,
};

const actionCreators = {
  fetchEntities,
};

export { actionCreators, actionTypes, initialState };

export default reducer;
