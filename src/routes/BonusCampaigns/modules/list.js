import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'bonus-campaigns';
const ENTITIES_REQUEST = `${KEY}/entities-request`;
const ENTITIES_SUCCESS = `${KEY}/entities-success`;
const ENTITIES_FAILURE = `${KEY}/entities-failure`;

function loadEntities(filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    const endpointParams = {
      page: 0,
    };

    if (filters.page !== undefined) {
      endpointParams.page = filters.page;
    }

    if (filters.state) {
      endpointParams.state = filters.state;
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [ENTITIES_REQUEST, ENTITIES_SUCCESS, ENTITIES_FAILURE],
        endpoint: `promotion/campaigns`,
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [ENTITIES_REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [ENTITIES_SUCCESS]: (state, action) => ({
    ...state,
    entities: { ...action.response },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [ENTITIES_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
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
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  ENTITIES_REQUEST,
  ENTITIES_SUCCESS,
  ENTITIES_FAILURE,
};

const actionCreators = {
  loadEntities,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
