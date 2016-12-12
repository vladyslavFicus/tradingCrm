import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';
import { actionCreators as usersActionCreators } from 'redux/modules/users';

const KEY = 'users';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);

function fetchEntities(filters = {}) {
  return usersActionCreators.fetchEntities(FETCH_ENTITIES)(filters);
}

const handlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
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
  error: null,
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
