import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';
import { sourceActionCreators as bonusActionCreators } from '../../../../../../../../../redux/modules/bonus';

const KEY = 'user-bonus';
const FETCH_ACTIVE_BONUS = createRequestAction(`${KEY}/fetch-active-bonus`);
const CHANGE_BONUS_STATE = createRequestAction(`${KEY}/change-bonus-state`);

const fetchActiveBonus = bonusActionCreators.fetchActiveBonus(FETCH_ACTIVE_BONUS);

function changeBonusState(action, bonusUUID, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}/${bonusUUID}/${action}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          { type: CHANGE_BONUS_STATE.REQUEST },
          {
            type: CHANGE_BONUS_STATE.SUCCESS,
            payload: {
              action,
              bonusUUID,
            },
          },
          { type: CHANGE_BONUS_STATE.FAILURE },
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
      [newState.data] = payload.content;
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
  CHANGE_BONUS_STATE,
};
const actionCreators = {
  fetchActiveBonus,
  changeBonusState,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
