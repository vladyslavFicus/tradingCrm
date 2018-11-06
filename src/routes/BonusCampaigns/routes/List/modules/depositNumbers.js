import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'bonusCampaigns/deposit-number';
const FETCH_DEPOSIT_NUMBERS = createRequestAction(`${KEY}/fetch-deposit-numbers`);

function fetchDepositNumbers() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'promotion/campaigns/deposit-numbers',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_DEPOSIT_NUMBERS.REQUEST,
          FETCH_DEPOSIT_NUMBERS.SUCCESS,
          FETCH_DEPOSIT_NUMBERS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  list: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_DEPOSIT_NUMBERS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_DEPOSIT_NUMBERS.SUCCESS]: (state, action) => ({
    ...state,
    list: action.payload.filter(x => x),
    isLoading: false,
  }),
  [FETCH_DEPOSIT_NUMBERS.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
  }),
};
const actionTypes = {
  FETCH_DEPOSIT_NUMBERS,
};
const actionCreators = {
  fetchDepositNumbers,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
