import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators as ipActionCreators } from '../../../../../redux/modules/auth/ip';
import createReducer from '../../../../../utils/createReducer';

const KEY = 'operator/ip';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);

const fetchEntities = ipActionCreators.fetchEntities(FETCH_ENTITIES);

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: action.meta.filters,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    list: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const initialState = {
  list: [],
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
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

export default createReducer(initialState, actionHandlers);
