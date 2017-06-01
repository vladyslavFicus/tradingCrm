import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../utils/createRequestAction';
import timestamp from '../../../utils/timestamp';
import { actionCreators as usersActionCreators } from '../../../redux/modules/users';

const KEY = 'user-profile';
const PROFILE = createRequestAction(`${KEY}/view`);
const FETCH_BALANCES = createRequestAction(`${KEY}/fetch-balances`);

const ADD_TAG = createRequestAction(`${KEY}/add-tag`);
const DELETE_TAG = createRequestAction(`${KEY}/delete-tag`);

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
    balance: { amount: 0, currency: 'EUR' },
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

const mapBalances = items => Object
  .keys(items)
  .reduce((result, item) => (
    result.push({
      amount: parseFloat(items[item].replace(item, '')).toFixed(2),
      currency: item,
    }),
      result
  ), []);

function fetchProfile(uuid) {
  return usersActionCreators.fetchProfile(PROFILE)(uuid);
}

function addTag(playerUUID, tag, priority) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/tags`,
        method: 'POST',
        types: [ADD_TAG.REQUEST, ADD_TAG.SUCCESS, ADD_TAG.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tag,
          tagPriority: priority,
        }),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function deleteTag(playerUUID, id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/tags/${id}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [DELETE_TAG.REQUEST, DELETE_TAG.SUCCESS, DELETE_TAG.FAILURE],
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function fetchBalances(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/wallet/balances/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_BALANCES.REQUEST,
          FETCH_BALANCES.SUCCESS,
          FETCH_BALANCES.FAILURE,
        ],
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
        endpoint: 'payment/lock/deposit',
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
        endpoint: `payment/lock/${uuid}/deposit`,
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
        endpoint: 'payment/lock/withdraw',
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
        endpoint: `payment/lock/${uuid}/withdraw`,
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
    .then(() => dispatch(fetchBalances(uuid)))
    .then(() => dispatch(checkLock(uuid)));
}

const balanceActionHandlers = {
  [FETCH_BALANCES.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_BALANCES.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      isLoading: false,
      receivedAt: timestamp(),
    };

    if (action.payload.balances) {
      const balances = mapBalances(action.payload.balances);

      if (balances.length > 0) {
        newState.data.balance = { ...balances[0] };
      }
    }

    return newState;
  },
  [FETCH_BALANCES.FAILURE]: (state, action) => ({
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
  ADD_TAG,
  DELETE_TAG,
  FETCH_BALANCES,
  CHECK_LOCK,
};

const actionCreators = {
  fetchProfile,
  addTag,
  deleteTag,
  loadFullProfile,
  checkLock,
  lockDeposit,
  unlockDeposit,
  lockWithdraw,
  unlockWithdraw,
  fetchBalances,
};

export {
  actionTypes,
  actionCreators,
};

export default rootReducer;
