import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'transactions';
const TRANSACTIONS_REQUEST = `${KEY}/transactions-request`;
const TRANSACTIONS_SUCCESS = `${KEY}/transactions-success`;
const TRANSACTIONS_FAILURE = `${KEY}/transactions-failure`;

function loadTransactions(page = 0, filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    const endpointParams = { page };
    if (filters.playerUUID) {
      endpointParams.playerUUID = filters.playerUUID;
    }
    if (filters.paymentType) {
      endpointParams.type = filters.paymentType;
    }

    if (filters.startDate && filters.endDate) {
      endpointParams.startDate = filters.startDate;
      endpointParams.endDate = filters.endDate;
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [TRANSACTIONS_REQUEST, TRANSACTIONS_SUCCESS, TRANSACTIONS_FAILURE],
        endpoint: `payment/transactions`,
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      page,
    });
  };
}

const actionHandlers = {
  [TRANSACTIONS_REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [TRANSACTIONS_SUCCESS]: (state, action) => ({
    ...state,
    transactions: { ...action.response },
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
  transactions: {
    first: null,
    last: null,
    number: null,
    numberOfElements: null,
    size: null,
    sort: null,
    totalElements: null,
    totalPages: null,
    content: [],
  },
  filters: {},
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
