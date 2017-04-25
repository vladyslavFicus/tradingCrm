import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import timestamp from '../../../utils/timestamp';
import { actions, authors, types } from '../../../constants/wallet';

const KEY = 'user-profile/wallet-limits';
const CHECK_LOCK = createRequestAction(`${KEY}/check-lock`);
const LOCK = createRequestAction(`${KEY}/lock`);
const UNLOCK = createRequestAction(`${KEY}/unlock`);

function checkLock(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [CHECK_LOCK.REQUEST, CHECK_LOCK.SUCCESS, CHECK_LOCK.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function lockWallet({ playerUUID, type, reason }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/${type}`,
        method: 'POST',
        types: [LOCK.REQUEST, LOCK.SUCCESS, LOCK.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, playerUUID }),
        bailout: !logged,
      },
    });
  };
}

function unlockWallet({ playerUUID, type, reason }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/${playerUUID}/${type}`,
        method: 'DELETE',
        types: [UNLOCK.REQUEST, UNLOCK.SUCCESS, UNLOCK.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
        bailout: !logged,
      },
    });
  };
}

function walletLimitAction({ playerUUID, action, type, reason }) {
  return async (dispatch) => {
    const actionFn = action === actions.LOCK
      ? lockWallet
      : unlockWallet;
    await dispatch(actionFn({ playerUUID, type, reason }));

    return dispatch(checkLock(playerUUID));
  };
}

const initialState = {
  entities: [],
  deposit: {
    locked: false,
    canUnlock: false,
  },
  withdraw: {
    locked: false,
    canUnlock: false,
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [CHECK_LOCK.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CHECK_LOCK.SUCCESS]: (state, action) => ({
    ...state,
    entities: action.payload,
    deposit: {
      locked: action.payload.some(i => i.type.toLowerCase() === types.DEPOSIT),
      canUnlock: action.payload.some(i => (
        i.author === authors.OPERATOR && i.type.toLowerCase() === types.DEPOSIT
      )),
    },
    withdraw: {
      locked: action.payload.some(i => i.type.toLowerCase() === types.WITHDRAW),
      canUnlock: action.payload.some(i => (
        i.author === authors.OPERATOR && i.type.toLowerCase() === types.WITHDRAW
      )),
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),

  [CHECK_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const actionTypes = {
  CHECK_LOCK,
  LOCK,
  UNLOCK,
};
const actionCreators = {
  checkLock,
  walletLimitAction,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
