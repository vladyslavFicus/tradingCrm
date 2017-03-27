import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'kyc';
const VERIFY_IDENTITY = createRequestAction(`${KEY}/verify-identity`);
const REFUSE_IDENTITY = createRequestAction(`${KEY}/refuse-identity`);

function verifyIdentity(playerUUID, type) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}/verify`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          VERIFY_IDENTITY.REQUEST,
          VERIFY_IDENTITY.SUCCESS,
          VERIFY_IDENTITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function refuseIdentity(playerUUID, type, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          REFUSE_IDENTITY.REQUEST,
          REFUSE_IDENTITY.SUCCESS,
          REFUSE_IDENTITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {};
const actionHandlers = {};

const actionTypes = {
  VERIFY_IDENTITY,
  REFUSE_IDENTITY,
};
const actionCreators = {
  verifyIdentity,
  refuseIdentity,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
