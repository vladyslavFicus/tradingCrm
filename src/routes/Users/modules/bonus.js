import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'user-bonus';
const FETCH_ACTIVE_BONUS = createRequestTypes(`${KEY}/fetch-active-bonus`);
const ACCEPT_BONUS = createRequestTypes(`${KEY}/accept-bonus`);
const CANCEL_BONUS = createRequestTypes(`${KEY}/cancel-bonus`);

function fetchActiveBonus(playerUUID) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [FETCH_ACTIVE_BONUS.REQUEST, FETCH_ACTIVE_BONUS.SUCCESS, FETCH_ACTIVE_BONUS.FAILURE],
        endpoint: `bonus/bonuses`,
        endpointParams: { state: 'IN_PROGRESS', playerUUID },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function acceptBonus(id) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'PUT',
        types: [ACCEPT_BONUS.REQUEST, ACCEPT_BONUS.SUCCESS, ACCEPT_BONUS.FAILURE],
        endpoint: `bonus/bonuses/${id}/accept`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function cancelBonus(id, playerUUID) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'PUT',
        types: [CANCEL_BONUS.REQUEST, CANCEL_BONUS.SUCCESS, CANCEL_BONUS.FAILURE],
        endpoint: `bonus/bonuses/${id}/cancel?playerUUID=${playerUUID}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ACTIVE_BONUS.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_ACTIVE_BONUS.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      isLoading: false,
      isFailed: false,
      receivedAt: getTimestamp(),
    };

    if (action.response.content && action.response.content.length > 0) {
      newState.data = action.response.content[0];
    }

    return newState;
  },
  [FETCH_ACTIVE_BONUS.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  data: null,
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};

function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_ACTIVE_BONUS,
  ACCEPT_BONUS,
  CANCEL_BONUS,
};
const actionCreators = {
  fetchActiveBonus,
  acceptBonus,
  cancelBonus,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
