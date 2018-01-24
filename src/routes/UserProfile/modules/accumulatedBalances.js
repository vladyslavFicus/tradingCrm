import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import config from '../../../config';
import { actionTypes as profileActionTypes } from './profile';

const emptyBalance = {
  amount: 0,
  currency: 'EUR',
};

const KEY = 'user/balances';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);

function fetchBalances(uuid) {
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
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => {
    const { walletCurrencyDeposits, walletCurrencyWithdraws } = payload;
    let currency = emptyBalance.currency;

    if (Object.keys(walletCurrencyDeposits).length > 0) {
      currency = Object.keys(walletCurrencyDeposits)[0];
    } else if (Object.keys(walletCurrencyWithdraws).length > 0) {
      currency = Object.keys(walletCurrencyWithdraws)[0];
    }

    return {
      ...state,
      data: {
        ...state.data,
        deposits: Object.keys(walletCurrencyDeposits).length !== 0 ? {
          amount: walletCurrencyDeposits[Object.keys(walletCurrencyDeposits)[0]],
          currency,
        } : { ...state.data.deposits, currency },
        withdraws: Object.keys(walletCurrencyWithdraws).length !== 0 ? {
          amount: walletCurrencyWithdraws[Object.keys(walletCurrencyWithdraws)[0]],
          currency,
        } : { ...state.data.withdraws, currency },
        withdrawable: {
          ...state.data.withdrawable,
          currency,
        },
      },
      isLoading: false,
      receivedAt: endRequestTime,
    };
  },
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [profileActionTypes.FETCH_PROFILE.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => {
    if (!payload.balances) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        ...payload.balances,
        withdraws: {
          ...state.data.withdraws,
          currency: payload.balances.total.currency,
        },
        deposits: {
          ...state.data.deposits,
          currency: payload.balances.total.currency,
        },
      },
      isLoading: false,
      receivedAt: endRequestTime,
    };
  },
};

const initialState = {
  data: {
    deposits: emptyBalance,
    withdraws: emptyBalance,
    withdrawable: emptyBalance,
    total: emptyBalance,
    bonus: emptyBalance,
    real: emptyBalance,
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchBalances,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
