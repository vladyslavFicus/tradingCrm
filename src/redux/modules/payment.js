import { CALL_API, getJSON } from 'redux-api-middleware';

function changePaymentStatus(type) {
  return ({ action, playerUUID, paymentId, options = {} }) => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/${paymentId}/${action}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
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

function fetchPaymentStatuses(type) {
  return (playerUUID, id) => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/${id}/statuses`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          {
            type: type.REQUEST,
            meta: { id },
          },
          {
            type: type.SUCCESS,
            payload: (action, state, res) => getJSON(res).then(json => ({
              ...json[0],
              paymentId: id,
            })),
          },
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchPaymentAccounts(type) {
  return playerUUID => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/accounts/${playerUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

function fetchPaymentMethods(type) {
  return () => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: '/payment/methods',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
  fetchPaymentMethods,
};

export {
  sourceActionCreators,
};
