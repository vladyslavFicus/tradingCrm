import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import timestamp from '../../../../../../../utils/timestamp';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../../../utils/createRequestAction';

const KEY = 'user-bonus';
const FETCH_ACTIVE_BONUS = createRequestAction(`${KEY}/fetch-active-bonus`);
const ACCEPT_BONUS = createRequestAction(`${KEY}/accept-bonus`);
const CANCEL_BONUS = createRequestAction(`${KEY}/cancel-bonus`);

function fetchActiveBonus(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}?${buildQueryString({ states: 'IN_PROGRESS' })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [FETCH_ACTIVE_BONUS.REQUEST, FETCH_ACTIVE_BONUS.SUCCESS, FETCH_ACTIVE_BONUS.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function acceptBonus(id, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}/${id}/accept`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          ACCEPT_BONUS.REQUEST,
          ACCEPT_BONUS.SUCCESS,
          ACCEPT_BONUS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function cancelBonus(id, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}/${id}/cancel`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CANCEL_BONUS.REQUEST,
          CANCEL_BONUS.SUCCESS,
          CANCEL_BONUS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ACTIVE_BONUS.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ACTIVE_BONUS.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      isLoading: false,
      receivedAt: timestamp(),
    };

    if (action.payload.content && action.payload.content.length > 0) {
      newState.data = action.payload.content[0];
    }

    return newState;
  },

  [FETCH_ACTIVE_BONUS.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const initialState = {
  data: null,
  error: null,
  isLoading: false,
  receivedAt: null,
};
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
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
