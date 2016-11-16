import { WEB_API, ContentType } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'user-profile';

const PROFILE = createRequestTypes(`${KEY}/view`);
const BALANCE = createRequestTypes(`${KEY}/balance`);

const CHECK_LOCK = createRequestTypes(`${KEY}/check-lock`);

const DEPOSIT_LOCK = createRequestTypes(`${KEY}/deposit-lock`);
const DEPOSIT_UNLOCK = createRequestTypes(`${KEY}/deposit-unlock`);

const WITHDRAW_LOCK = createRequestTypes(`${KEY}/withdraw-lock`);
const WITHDRAW_UNLOCK = createRequestTypes(`${KEY}/withdraw-unlock`);

const profileInitialState = {
  data: {
    id: null,
    username: null,
    email: null,
    currency: null,
    balance: null,
  },
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
const depositInitialState = {
  reasons: [],
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
const withdrawInitialState = {
  reasons: [],
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};

export const initialState = {
  profile: profileInitialState,
  deposit: depositInitialState,
  withdraw: withdrawInitialState,
};

function loadProfile(uuid) {
  return (dispatch, getState) => {
    const { auth } = getState();
    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [PROFILE.REQUEST, PROFILE.SUCCESS, PROFILE.FAILURE],
        endpoint: `profile/profiles/${uuid}`,
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      },
    });
  };
}

function getBalance(uuid) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [BALANCE.REQUEST, BALANCE.SUCCESS, BALANCE.FAILURE],
        endpoint: `wallet/balance/${uuid}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function checkLock(uuid) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [CHECK_LOCK.REQUEST, CHECK_LOCK.SUCCESS, CHECK_LOCK.FAILURE],
        endpoint: `payment/lock/${uuid}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function lockDeposit(uuid, reason) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'POST',
        type: ContentType.FORM_DATA,
        types: [DEPOSIT_LOCK.REQUEST, DEPOSIT_LOCK.SUCCESS, DEPOSIT_LOCK.FAILURE],
        endpoint: `payment/lock/deposit/${uuid}`,
        endpointParams: { reason },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    })
      .then(() => dispatch(checkLock(uuid)));
  };
}

function unlockDeposit(uuid) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'DELETE',
        types: [DEPOSIT_UNLOCK.REQUEST, DEPOSIT_UNLOCK.SUCCESS, DEPOSIT_UNLOCK.FAILURE],
        endpoint: `payment/lock/deposit/${uuid}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    })
      .then(() => dispatch(checkLock(uuid)));
  };
}

function lockWithdraw(uuid, reason) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'POST',
        type: ContentType.FORM_DATA,
        types: [WITHDRAW_LOCK.REQUEST, WITHDRAW_LOCK.SUCCESS, WITHDRAW_LOCK.FAILURE],
        endpoint: `payment/lock/withdraw/${uuid}`,
        endpointParams: { reason },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    }).then(() => dispatch(checkLock(uuid)));
  };
}

function unlockWithdraw(uuid) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'DELETE',
        types: [WITHDRAW_UNLOCK.REQUEST, WITHDRAW_UNLOCK.SUCCESS, WITHDRAW_UNLOCK.FAILURE],
        endpoint: `payment/lock/withdraw/${uuid}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    })
      .then(() => dispatch(checkLock(uuid)));
  };
}

function loadFullProfile(uuid) {
  return dispatch => dispatch(loadProfile(uuid))
    .then(() => dispatch(getBalance(uuid)))
    .then(() => dispatch(checkLock(uuid)));
}

const balanceActionHandlers = {
  [BALANCE.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [BALANCE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      balance: action.response.balance !== undefined ? action.response.balance : 0.00,
    },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [BALANCE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};
const profileActionHandlers = {
  [PROFILE.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.response,
    },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
  ...balanceActionHandlers,
};
const depositActionHandlers = {
  [CHECK_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailure: false,
  }),
  [CHECK_LOCK.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      reasons: [],
      isLoading: false,
      isFailure: false,
      receivedAt: getTimestamp(),
    };

    newState.reasons = action.response.reduce((result, current) => {
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
    isFailure: true,
    receivedAt: getTimestamp(),
  }),

  [DEPOSIT_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailure: false,
  }),
  [DEPOSIT_LOCK.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailure: false,
    receivedAt: getTimestamp(),
  }),
  [DEPOSIT_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailure: true,
    receivedAt: getTimestamp(),
  }),
};
const withdrawActionHandlers = {
  [CHECK_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailure: false,
  }),
  [CHECK_LOCK.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      reasons: [],
      isLoading: false,
      isFailure: false,
      receivedAt: getTimestamp(),
    };

    newState.reasons = action.response.reduce((result, current) => {
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
    isFailure: true,
    receivedAt: getTimestamp(),
  }),

  [WITHDRAW_LOCK.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailure: false,
  }),
  [WITHDRAW_LOCK.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailure: false,
    receivedAt: getTimestamp(),
  }),
  [WITHDRAW_LOCK.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailure: true,
    receivedAt: getTimestamp(),
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
  loadProfile,
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
