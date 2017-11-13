import { CALL_API } from 'redux-api-middleware';

function updateProfile(type) {
  return (uuid, data) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          email: undefined,
        }),
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

function passwordResetRequest(type) {
  return (uuid) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/password/${uuid}/reset/request`,
        method: 'POST',
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
    })
  };
}

function sendInvitationRequest(type) {
  return operatorUUID => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators/${operatorUUID}/send/invitation`,
        method: 'PUT',
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

function passwordResetConfirm(type) {
  return ({ password, token }) => dispatch => dispatch({
    [CALL_API]: {
      endpoint: '/operator/public/operators/activate',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, token }),
      types: [
        type.REQUEST,
        type.SUCCESS,
        type.FAILURE,
      ],
    },
  });
}

function fetchProfile(type) {
  return (uuid, insideToken = null) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${insideToken || token}`,
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged && !insideToken,
      },
    });
  };
}

function fetchAuthorities(type) {
  return (uuid, outsideToken = null) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/authorities`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${outsideToken || token}`,
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged && !outsideToken,
      },
    });
  };
}

const sourceActionCreators = {
  fetchProfile,
  fetchAuthorities,
  passwordResetRequest,
  passwordResetConfirm,
  sendInvitationRequest,
  updateProfile,
};

export {
  sourceActionCreators,
};
