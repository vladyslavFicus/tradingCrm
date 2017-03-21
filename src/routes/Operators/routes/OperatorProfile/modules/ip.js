import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actionCreators as ipActionCreators } from '../../../../../redux/modules/ip';

const KEY = 'user/ip';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);

function fetchEntities(uuid, filters = {}) {
  return ipActionCreators.fetchEntities(FETCH_ENTITIES)(uuid, filters);
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.meta.filters },
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
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
