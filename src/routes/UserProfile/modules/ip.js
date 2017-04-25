import createReducer from '../../../utils/createReducer';
import timestamp from '../../../utils/timestamp';
import createRequestAction from '../../../utils/createRequestAction';
import { sourceActionCreators as ipActionCreators } from '../../../redux/modules/ip';

const KEY = 'user/ip';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const fetchIPs = ipActionCreators.fetchEntities(FETCH_ENTITIES);

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: action.meta.filters,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    list: action.payload,
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
  fetchIPs,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
