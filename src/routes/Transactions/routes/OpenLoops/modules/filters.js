import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators as paymentsActionCreators } from '../../../../../redux/modules/payment';

const KEY = 'transactions/filters';
const FETCH_FILTERS = createRequestAction(`${KEY}/fetch-filters`);

const fetchFilters = paymentsActionCreators.fetchPaymentMethods(FETCH_FILTERS);

const initialState = {
  data: {
    paymentMethods: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_FILTERS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_FILTERS.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: {
      ...state.data,
      paymentMethods: payload,
    },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_FILTERS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const actionTypes = {
  FETCH_FILTERS,
};
const actionCreators = {
  fetchFilters,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
