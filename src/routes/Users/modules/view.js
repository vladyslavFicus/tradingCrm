import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import timestamp from 'utils/timestamp';
import { actionCreators as usersActionCreators } from 'redux/modules/users';

const KEY = 'user-profile';
const PROFILE = createRequestAction(`${KEY}/view`);
const BALANCE = createRequestAction(`${KEY}/balance`);

const CHECK_LOCK = createRequestAction(`${KEY}/check-lock`);

const DEPOSIT_LOCK = createRequestAction(`${KEY}/deposit-lock`);
const DEPOSIT_UNLOCK = createRequestAction(`${KEY}/deposit-unlock`);

const WITHDRAW_LOCK = createRequestAction(`${KEY}/withdraw-lock`);
const WITHDRAW_UNLOCK = createRequestAction(`${KEY}/withdraw-unlock`);

const profileInitialState = {
  data: {
    id: null,
    username: null,
    email: null,
    currency: null,
    balance: null,
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const depositInitialState = {
  reasons: [],
  error: false,
  isLoading: false,
  receivedAt: null,
};
const withdrawInitialState = {
  reasons: [],
  error: false,
  isLoading: false,
  receivedAt: null,
};

export const initialState = {
  profile: profileInitialState,
  deposit: depositInitialState,
  withdraw: withdrawInitialState,
};

function fetchProfile(uuid) {
  return usersActionCreators.fetchProfile(PROFILE)(uuid);
}

function getBalance(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `wallet/balance/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [BALANCE.REQUEST, BALANCE.SUCCESS, BALANCE.FAILURE],
        bailout: !logged,
      },
    });
  };
}

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

function lockDeposit(playerUUID, reason) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/deposit`,
        method: 'POST',
        types: [DEPOSIT_LOCK.REQUEST, DEPOSIT_LOCK.SUCCESS, DEPOSIT_LOCK.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason,
          playerUUID,
        }),
        bailout: !logged,
      },
    })
      .then(() => dispatch(checkLock(playerUUID)));
  };
}

function unlockDeposit(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/deposit/${uuid}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [DEPOSIT_UNLOCK.REQUEST, DEPOSIT_UNLOCK.SUCCESS, DEPOSIT_UNLOCK.FAILURE],
        bailout: !logged,
      },
    })
      .then(() => dispatch(checkLock(uuid)));
  };
}

function lockWithdraw(playerUUID, reason) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/withdraw`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason,
          playerUUID,
        }),
        types: [WITHDRAW_LOCK.REQUEST, WITHDRAW_LOCK.SUCCESS, WITHDRAW_LOCK.FAILURE],
        bailout: !logged,
      },
    }).then(() => dispatch(checkLock(playerUUID)));
  };
}

function unlockWithdraw(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/withdraw/${uuid}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [WITHDRAW_UNLOCK.REQUEST, WITHDRAW_UNLOCK.SUCCESS, WITHDRAW_UNLOCK.FAILURE],
        bailout: !logged,
      },
    })
      .then(() => dispatch(checkLock(uuid)));
  };
}

function loadFullProfile(uuid) {
  return dispatch => dispatch(fetchProfile(uuid))
    .then(() => dispatch(getBalance(uuid)))
    .then(() => dispatch(checkLock(uuid)));
}

const balanceActionHandlers = {
  [BALANCE.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [BALANCE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      balance: action.payload.balance !== undefined ? action.payload.balance : 0.00,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [BALANCE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const profileActionHandlers = {
  [PROFILE.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  ...balanceActionHandlers,
};
const depositActionHandlers = {
  [CHECK_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CHECK_LOCK.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      reasons: [],
      isLoading: false,
      receivedAt: timestamp(),
    };

    newState.reasons = action.payload.reduce((result, current) => {
      if (current.type === 'DEPOSIT') {
        result.push(current);
      }

      return result;
    }, []);

    return newState;
  },

  [CHECK_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),

  [DEPOSIT_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [DEPOSIT_LOCK.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [DEPOSIT_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const withdrawActionHandlers = {
  [CHECK_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [CHECK_LOCK.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      reasons: [],
      isLoading: false,
      receivedAt: timestamp(),
    };

    newState.reasons = action.payload.reduce((result, current) => {
      if (current.type === 'WITHDRAW') {
        result.push(current);
      }

      return result;
    }, []);

    return newState;
  },

  [CHECK_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),

  [WITHDRAW_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [WITHDRAW_LOCK.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [WITHDRAW_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

function reducer(handlers, state, action) {
  const handler = handlers[action.type];

  return handler ? handler(state, action) : state;
}

function rootReducer(state = initialState, action) {
  return {
    profile: reducer(profileActionHandlers, state.profile, action),
    deposit: reducer(depositActionHandlers, state.deposit, action),
    withdraw: reducer(withdrawActionHandlers, state.withdraw, action),
  };
}

const actionTypes = {
  PROFILE,
  BALANCE,
  CHECK_LOCK,
};

const actionCreators = {
  fetchProfile,
  getBalance,
  loadFullProfile,
  checkLock,
  lockDeposit,
  unlockDeposit,
  lockWithdraw,
  unlockWithdraw,
};

export {
  actionTypes,
  actionCreators,
};

export default rootReducer;
