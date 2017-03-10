import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';
import { actionCreators as usersActionCreators } from 'redux/modules/users';

const KEY = 'users';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);

function fetchESEntities(filters = {}) {
  return usersActionCreators.fetchESEntities(FETCH_ENTITIES)(filters);
}

const actionHandlers = {
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
      content: action.payload.number === 0
        ? action.payload.content
        : [
          ...state.entities.content,
          ...action.payload.content
        ],
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
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_ENTITIES,
};

const actionCreators = {
  fetchESEntities,
};

export { actionCreators, actionTypes, initialState };

export default reducer;
