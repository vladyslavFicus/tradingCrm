import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import timestamp from '../../../utils/timestamp';
import { actions } from '../../../constants/wallet';

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

function walletLimitAction({ playerUUID, action, type, reason }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/lock/${playerUUID}/${type}`,
        method: action === actions.UNLOCK ? 'DELETE' : 'POST',
        types: [LOCK.REQUEST, LOCK.SUCCESS, LOCK.FAILURE],
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

const initialState = {
  entities: [],
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
