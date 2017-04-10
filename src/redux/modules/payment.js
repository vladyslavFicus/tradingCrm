import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../utils/createRequestAction';

const KEY = 'payment';
const CHANGE_PAYMENT_STATUS = createRequestAction(`${KEY}/change-payment-status`);
const FETCH_PAYMENT_TRANSACTIONS = createRequestAction(`${KEY}/fetch-payment-transactions`);

function changePaymentStatus({ status, paymentId, options = {} }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${paymentId}/${status}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
        types: [CHANGE_PAYMENT_STATUS.REQUEST, CHANGE_PAYMENT_STATUS.SUCCESS, CHANGE_PAYMENT_STATUS.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function fetchPaymentStatuses(id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${id}/statuses`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_PAYMENT_TRANSACTIONS.REQUEST,
            meta: { id },
          },
          FETCH_PAYMENT_TRANSACTIONS.SUCCESS,
          FETCH_PAYMENT_TRANSACTIONS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionTypes = {
  CHANGE_PAYMENT_STATUS,
};
const actionCreators = {
  changePaymentStatus,
  fetchPaymentStatuses,
};

export {
  actionTypes,
  actionCreators,
};
