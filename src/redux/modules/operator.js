import { CALL_API } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import { actionCreators as optionsActionCreators } from './profile/options';

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
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged, brandId } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/password/${brandId}/${uuid}/reset/request`,
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
    });
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
  return ({ password, token }) => (dispatch, getState) => {
    const { auth: { brandId } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/operator/public/operators/activate?brandId=${brandId}`,
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
  };
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
    const { auth: { token: authToken, logged } } = getState();
    const token = outsideToken || authToken;
    let brandId = null;

    const decodedToken = jwtDecode(token);

    if (decodedToken) {
      brandId = decodedToken.brandId;
    }

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/authorities`,
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
        bailout: !logged && !token,
      },
    })
      .then(() => dispatch(optionsActionCreators.fetchSignUp(brandId)));
  };
}

function fetchHierarchy(type) {
  return (uuid, outsideToken = null) => (dispatch, getState) => {
    const { auth: { token: authToken, logged } } = getState();
    const token = outsideToken || authToken;
    return dispatch({
      [CALL_API]: {
        endpoint: `trading_hierarchy_updater/user/${uuid}/hierarchy`,
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
        bailout: !logged && !token,
      },
    });
  };
}

const sourceActionCreators = {
  fetchProfile,
  fetchAuthorities,
  fetchHierarchy,
  passwordResetRequest,
  passwordResetConfirm,
  sendInvitationRequest,
  updateProfile,
};

export {
  sourceActionCreators,
};
