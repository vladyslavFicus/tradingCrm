import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import timestamp from '../../../utils/timestamp';
import createRequestAction from '../../../utils/createRequestAction';
import config from '../../../config/index';
import { actionTypes as bonusActionTypes } from './bonus';
import { actionTypes as viewActionTypes, mapBalances } from './view';

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
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      deposits: Object.keys(action.payload.walletCurrencyDeposits).length !== 0 ? {
        amount: action.payload.walletCurrencyDeposits[Object.keys(action.payload.walletCurrencyDeposits)[0]],
        currency: Object.keys(action.payload.walletCurrencyDeposits)[0],
      } : state.data.deposits,
      withdraws: Object.keys(action.payload.walletCurrencyWithdraws).length !== 0 ? {
        amount: action.payload.walletCurrencyWithdraws[Object.keys(action.payload.walletCurrencyWithdraws)[0]],
        currency: Object.keys(action.payload.walletCurrencyWithdraws)[0],
      } : state.data.withdraws,
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
  [bonusActionTypes.FETCH_ACTIVE_BONUS.SUCCESS]: (state, action) => {
    if (!action.payload.content || action.payload.content.length === 0) {
      return state;
    }

    const newState = {
      ...state,
    };

    newState.data.bonus = action.payload.content[0].balance;

    const total = state.data.total;

    newState.data.real = total && total.amount ? {
      amount: total.amount - newState.data.bonus.amount,
      currency: total.currency,
    } : total;

    return newState;
  },

  [viewActionTypes.FETCH_BALANCES.SUCCESS]: (state, action) => {
    if (!action.payload.balances) {
      return state;
    }

    const newState = {
      ...state,
      isLoading: false,
      receivedAt: timestamp(),
    };

    const balances = mapBalances(action.payload.balances);
    newState.data.total = { ...balances[0] };

    ['deposits', 'withdraws', 'bonus', 'real'].forEach((key) => {
      newState.data[key] = { ...balances[0], amount: newState.data[key].amount };
    });

    return newState;
  },
};

const emptyBalance = {
  amount: 0,
  currency: config.nas.currencies.base,
};

const initialState = {
  data: {
    deposits: emptyBalance,
    withdraws: emptyBalance,
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
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
