import createReducer from 'utils/createReducer';
import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'user/balances';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);

function fetchEntities(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/accumulated/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      deposits: Object.keys(action.payload.walletCurrencyDeposits).length !== 0 ? {
        amount: action.payload.walletCurrencyDeposits[Object.keys(action.payload.walletCurrencyDeposits)[0]],
        currency: Object.keys(action.payload.walletCurrencyDeposits)[0],
      } : null,
      withdraws: Object.keys(action.payload.walletCurrencyWithdraws).length !== 0 ? {
        amount: action.payload.walletCurrencyWithdraws[Object.keys(action.payload.walletCurrencyWithdraws)[0]],
        currency: Object.keys(action.payload.walletCurrencyWithdraws)[0],
      } : null,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

const initialState = {
  data: {
    deposits: null,
    withdraws: null,
    total: null,
    bonus: null,
    real: null,
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
