import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'user-profile';
const PROFILE_REQUEST = `${KEY}/view-request`;
const PROFILE_SUCCESS = `${KEY}/view-success`;
const PROFILE_FAILURE = `${KEY}/view-failure`;

const BALANCE_REQUEST = `${KEY}/balance-request`;
const BALANCE_SUCCESS = `${KEY}/balance-success`;
const BALANCE_FAILURE = `${KEY}/balance-failure`;

function loadProfile(uuid) {
  return (dispatch, getState) => {
    const { auth } = getState();
    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
        endpoint: `profile/profiles/${uuid}`,
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      },
    });
  };
}

function getBalance(playerUUID) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [BALANCE_REQUEST, BALANCE_SUCCESS, BALANCE_FAILURE],
        endpoint: `wallet/balance/${playerUUID}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function loadFullProfile(uuid) {
  return dispatch => dispatch(loadProfile(uuid))
    .then((action) => {
      if (action.type === PROFILE_SUCCESS) {
        return dispatch(getBalance(uuid));
      }

      return action;
    });
}

const actionHandlers = {
  [PROFILE_REQUEST]: (state, action) => ({ ...state, isLoading: true, isFailed: false }),
  [PROFILE_SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.response,
    },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [PROFILE_FAILURE]: (state, action) => ({ ...state, isLoading: false, isFailed: true, receivedAt: getTimestamp() }),
  [BALANCE_REQUEST]: (state, action) => ({ ...state, isLoading: true, isFailed: false }),
  [BALANCE_SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      balance: action.response.balance !== undefined ? action.response.balance : 0.00,
    },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [BALANCE_FAILURE]: (state, action) => ({ ...state, isLoading: false, isFailed: true, receivedAt: getTimestamp() }),
};

const initialState = {
  data: {
    id: null,
    username: null,
    email: null,
    currency: null,
    balance: 0.00,
  },
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
};

const actionCreators = {
  loadProfile,
  getBalance,
  loadFullProfile,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
