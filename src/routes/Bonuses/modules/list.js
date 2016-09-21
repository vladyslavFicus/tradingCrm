import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'bonuses';
const ENTITIES = createRequestTypes(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    const endpointParams = {
      orderByPriority: true,
      page: 0,
    };

    if (filters.page !== undefined) {
      endpointParams.page = filters.page;
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [
          ENTITIES.REQUEST,
          ENTITIES.SUCCESS,
          ENTITIES.FAILURE,
        ],
        endpoint: `bonus/bonuses`,
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: { ...action.response },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [ENTITIES.FAILURE]: (state, action) => ({
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
  ENTITIES,
};

const actionCreators = {
  fetchEntities,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
