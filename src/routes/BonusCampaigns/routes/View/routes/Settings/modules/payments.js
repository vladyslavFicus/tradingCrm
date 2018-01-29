import createRequestAction from '../../../../../../../utils/createRequestAction';
import createReducer from '../../../../../../../utils/createReducer';
import { sourceActionCreators as paymentsActionCreators } from '../../../../../../../redux/modules/payment';

const KEY = 'bonus-campaign/view/fetch-campaigns';
const FETCH_PAYMENT_METHODS = createRequestAction(`${KEY}/fetch-payment-methods`);

const fetchPaymentMethods = paymentsActionCreators.fetchPaymentMethods(FETCH_PAYMENT_METHODS);

const initialState = {
  list: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_PAYMENT_METHODS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_PAYMENT_METHODS.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    list: payload.map(paymentMethod => ({
      methodName: paymentMethod.methodName,
      uuid: paymentMethod.uuid,
    })),
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_PAYMENT_METHODS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};

const actionTypes = {
  FETCH_PAYMENT_METHODS,
};

const actionCreators = {
  fetchPaymentMethods,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
