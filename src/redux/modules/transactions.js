import { sourceActionCreators as paymentSourceActionCreators } from './payment';
import createRequestAction from '../../utils/createRequestAction';

const KEY = 'user/transactions';
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);

const fetchPaymentStatuses = paymentSourceActionCreators.fetchPaymentStatuses(FETCH_PAYMENT_STATUSES);

const actionTypes = {
  FETCH_PAYMENT_STATUSES,
};

const actionCreators = {
  fetchPaymentStatuses,
};

export {
  actionTypes,
  actionCreators,
};
