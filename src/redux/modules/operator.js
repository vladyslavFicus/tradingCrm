import { CALL_API } from 'redux-api-middleware';

function passwordResetRequest(type) {
  return ({ email }) => (dispatch, getState) => dispatch({
    [CALL_API]: {
      endpoint: `auth/password/reset/request`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      types: [
        type.REQUEST,
        type.SUCCESS,
        type.FAILURE,
      ],
    },
  });
}

function passwordResetConfirm(type) {
  return ({ password, repeatPassword, token }) => (dispatch, getState) => dispatch({
    [CALL_API]: {
      endpoint: `/auth/password/reset`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, repeatPassword, token }),
      types: [
        type.REQUEST,
        type.SUCCESS,
        type.FAILURE,
      ],
    },
  });
}

const sourceActionCreators = {
  passwordResetRequest,
  passwordResetConfirm,
};

export {
  sourceActionCreators,
};
