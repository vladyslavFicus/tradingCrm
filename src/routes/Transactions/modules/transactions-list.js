import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'transactions';
const TRANSACTIONS_REQUEST = `${KEY}/transactions-request`;
const TRANSACTIONS_SUCCESS = `${KEY}/transactions-success`;
const TRANSACTIONS_FAILURE = `${KEY}/transactions-failure`;

function loadTransactions(page = 0, uuid = '') {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [TRANSACTIONS_REQUEST, TRANSACTIONS_SUCCESS, TRANSACTIONS_FAILURE],
        endpoint: `payment/transactions/${uuid}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      page,
    });
  };
}

const actionHandlers = {
  [TRANSACTIONS_REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [TRANSACTIONS_SUCCESS]: (state, action) => ({
    ...state,
    data: { ...state.data, items: action.response },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [TRANSACTIONS_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  data: {
    items: [],
    hasNext: true,
  },
  page: 0,
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  TRANSACTIONS_REQUEST,
  TRANSACTIONS_SUCCESS,
  TRANSACTIONS_FAILURE,
};

const actionCreators = {
  loadTransactions,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
