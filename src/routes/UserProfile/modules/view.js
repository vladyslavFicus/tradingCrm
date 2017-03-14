import { combineReducers }from 'redux';
import createReducer from 'utils/createReducer';
import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import timestamp from 'utils/timestamp';
import { actions } from 'constants/user';
import { actionCreators as usersActionCreators } from 'redux/modules/users';

const KEY = 'user-profile';
const PROFILE = createRequestAction(`${KEY}/view`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);
const UPDATE_IDENTIFIER = createRequestAction(`${KEY}/update-identifier`);
const BALANCE = createRequestAction(`${KEY}/balance`);
const FETCH_BALANCES = createRequestAction(`${KEY}/fetch-balances`);

const SUSPEND_PROFILE = createRequestAction(`${KEY}/suspend-profile`);
const RESUME_PROFILE = createRequestAction(`${KEY}/resume-profile`);
const BLOCK_PROFILE = createRequestAction(`${KEY}/block-profile`);
const UNBLOCK_PROFILE = createRequestAction(`${KEY}/unblock-profile`);

const UPDATE_SUBSCRIPTION = createRequestAction(`${KEY}/update-subscription`);

const CHECK_LOCK = createRequestAction(`${KEY}/check-lock`);

const ADD_TAG = createRequestAction(`${KEY}/add-tag`);
const DELETE_TAG = createRequestAction(`${KEY}/delete-tag`);

const DEPOSIT_LOCK = createRequestAction(`${KEY}/deposit-lock`);
const DEPOSIT_UNLOCK = createRequestAction(`${KEY}/deposit-unlock`);

const WITHDRAW_LOCK = createRequestAction(`${KEY}/withdraw-lock`);
const WITHDRAW_UNLOCK = createRequestAction(`${KEY}/withdraw-unlock`);

const profileInitialState = {
  data: {
    id: null,
    username: null,
    email: null,
    currencyCode: null,
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

const initialState = {
  profile: profileInitialState,
  deposit: depositInitialState,
  withdraw: withdrawInitialState,
};

const mapBalances = (items) =>
  Object
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

function updateProfile(uuid, data) {
  return usersActionCreators.updateProfile(UPDATE_PROFILE)(uuid, data);
}

function updateIdentifier(uuid, identifier) {
  return usersActionCreators.updateIdentifier(UPDATE_IDENTIFIER)(uuid, identifier);
}

function updateSubscription(playerUUID, name, value) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/subscription`,
        method: 'PUT',
        types: [
          UPDATE_SUBSCRIPTION.REQUEST,
          UPDATE_SUBSCRIPTION.SUCCESS,
          UPDATE_SUBSCRIPTION.FAILURE,
        ],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [name]: value }),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
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

function suspendProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/suspend`,
        method: 'PUT',
        types: [SUSPEND_PROFILE.REQUEST, SUSPEND_PROFILE.SUCCESS, SUSPEND_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function resumeProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/resume`,
        method: 'PUT',
        types: [RESUME_PROFILE.REQUEST, RESUME_PROFILE.SUCCESS, RESUME_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function blockProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/block`,
        method: 'PUT',
        types: [BLOCK_PROFILE.REQUEST, BLOCK_PROFILE.SUCCESS, BLOCK_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function unblockProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/unblock`,
        method: 'PUT',
        types: [UNBLOCK_PROFILE.REQUEST, UNBLOCK_PROFILE.SUCCESS, UNBLOCK_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function changeStatus({ action, ...data }) {
  return dispatch => {
    if (action === actions.BLOCK) {
      return dispatch(blockProfile(data));
    } else if (action === actions.UNBLOCK) {
      return dispatch(unblockProfile(data));
    } else if (action === actions.SUSPEND) {
      return dispatch(suspendProfile(data));
    } else if (action === actions.RESUME) {
      return dispatch(unblockProfile(data));
    }

    throw new Error(`Unknown status change action "${action}".`);
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
        newState.data.currencyCode = newState.data.balance.currency;
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

const actionTypes = {
  PROFILE,
  ADD_TAG,
  DELETE_TAG,
  BALANCE,
  CHECK_LOCK,
  UPDATE_PROFILE,
};
const actionCreators = {
  fetchProfile,
  updateProfile,
  updateIdentifier,
  updateSubscription,
  getBalance,
  loadFullProfile,
  checkLock,
  lockDeposit,
  unlockDeposit,
  lockWithdraw,
  unlockWithdraw,
  fetchBalances,
  changeStatus,
  addTag,
  deleteTag,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  profile: createReducer(profileInitialState, profileActionHandlers),
  deposit: createReducer(depositInitialState, depositActionHandlers),
  withdraw: createReducer(withdrawInitialState, withdrawActionHandlers),
});
