import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../../../utils/createRequestAction';

const KEY = 'user-bonus';
const FETCH_ACTIVE_BONUS = createRequestAction(`${KEY}/fetch-active-bonus`);
const ACCEPT_BONUS = createRequestAction(`${KEY}/accept-bonus`);
const CANCEL_BONUS = createRequestAction(`${KEY}/cancel-bonus`);
const PERMIT_BONUS_CONVERSION = createRequestAction(`${KEY}/permit-bonus-conversion`);

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

function acceptBonus(bonusUUID, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}/${bonusUUID}/accept`,
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

function cancelBonus(bonusUUID, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}/${bonusUUID}/cancel`,
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

function permitBonusConversion(bonusUUID, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}/${bonusUUID}/permit-conversion`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          PERMIT_BONUS_CONVERSION.REQUEST,
          PERMIT_BONUS_CONVERSION.SUCCESS,
          PERMIT_BONUS_CONVERSION.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ACTIVE_BONUS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ACTIVE_BONUS.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => {
    const newState = {
      ...state,
      isLoading: false,
      receivedAt: endRequestTime,
    };

    if (payload.content && payload.content.length > 0) {
      newState.data = payload.content[0];
    }

    return newState;
  },

  [FETCH_ACTIVE_BONUS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
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
  PERMIT_BONUS_CONVERSION,
};
const actionCreators = {
  fetchActiveBonus,
  acceptBonus,
  cancelBonus,
  permitBonusConversion,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
