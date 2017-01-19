import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'currencies';
const FETCH_CURRENCIES = createRequestAction(`${KEY}/fetch-currencies`);

function fetchCurrencies() {
  return {
    [CALL_API]: {
      endpoint: '/fx_rate/currency/supported',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_CURRENCIES.REQUEST,
        FETCH_CURRENCIES.SUCCESS,
        FETCH_CURRENCIES.FAILURE,
      ],
    },
  };
}

const initialState = {
  list: [],
  error: null,
  isLoading: null,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_CURRENCIES.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_CURRENCIES.SUCCESS]: (state, action) => ({
    ...state,
    list: [...action.payload],
    isLoading: false,
  }),
  [FETCH_CURRENCIES.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
  }),
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  FETCH_CURRENCIES,
};
const actionCreators = {
  fetchCurrencies,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
