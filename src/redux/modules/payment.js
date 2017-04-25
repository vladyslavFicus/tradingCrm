import { CALL_API } from 'redux-api-middleware';

function changePaymentStatus(type) {
  return ({ action, playerUUID, paymentId, options = {} }) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/${paymentId}/${action}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchPaymentStatuses(type) {
  return (playerUUID, id) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/${id}/statuses`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: type.REQUEST,
            meta: { id },
          },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchPaymentAccounts(type) {
  return playerUUID => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/accounts/${playerUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const sourceActionCreators = {
  changePaymentStatus,
  fetchPaymentStatuses,
  fetchPaymentAccounts,
};

export {
  sourceActionCreators,
};
