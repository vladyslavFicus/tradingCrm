import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';
import { actionCreators as usersActionCreators } from 'redux/modules/users';

const KEY = 'users-review';
const FETCH_ENTITIES = createRequestTypes(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return usersActionCreators.fetchEntities(FETCH_ENTITIES)({
    page: 0,
    state: 'IN_REVIEW',
    ...filters,
  });
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
  isFailed: false,
  receivedAt: null,
};
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

function reducer(state = initialState, action) {
  const handler = handlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionCreators = {
  fetchEntities,
};

export { actionCreators, };

export default reducer;
