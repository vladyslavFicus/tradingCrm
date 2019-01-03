import createReducer from '../../../utils/createReducer';
import { sourceActionCreators } from '../payment';
import createRequestAction from '../../../utils/createRequestAction';

const KEY = 'user/transactions';
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);
const fetchPaymentStatuses = sourceActionCreators.fetchPaymentStatuses(FETCH_PAYMENT_STATUSES);

const actionCreators = { fetchPaymentStatuses };
const initialState = {};
const actionHandlers = {
  [FETCH_PAYMENT_STATUSES.SUCCESS]: (state, action) => ({
    ...state,
    [action.payload.paymentId]: action.payload.reason,
  }),
};

export {
  initialState,
  actionHandlers,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
