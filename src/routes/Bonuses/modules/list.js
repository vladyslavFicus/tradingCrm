import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'bonuses';
const FETCH_ENTITIES = createRequestTypes(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    const endpointParams = {
      page: filters.page ? filters.page : 0,
    };

    if (filters.label) {
      endpointParams.label = filters.label;
    }

    if (filters.state) {
      endpointParams.state = filters.state;
    }

    if (filters.startDate && filters.endDate) {
      endpointParams.startDate = filters.startDate;
      endpointParams.endDate = filters.endDate;
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        endpoint: `bonus/bonuses`,
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: { ...action.response },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
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
  FETCH_ENTITIES,
};

const actionCreators = {
  fetchEntities,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
