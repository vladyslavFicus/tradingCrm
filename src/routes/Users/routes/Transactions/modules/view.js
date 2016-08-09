import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'transactions-view';
const TRANSACTIONS_REQUEST = `${KEY}/transactions-request`;
const TRANSACTIONS_SUCCESS = `${KEY}/transactions-success`;
const TRANSACTIONS_FAILURE = `${KEY}/transactions-failure`;

function loadTransactions(page = 0, uuid) {
  return (dispatch, getState) => {
    const { auth } = getState();
    uuid = uuid || auth.uuid;

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [TRANSACTIONS_REQUEST, TRANSACTIONS_SUCCESS, TRANSACTIONS_FAILURE],
        endpoint: `payment/payments/${uuid}`,
        endpointParams: { page },
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      },
      page,
    });
  };
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function getFakeTransactions(count, page) {
  const fake = {
    description: 'Play game, payed by CARD #XXXX-XXXX-XXXX-0000',
    type: ['Deposit', 'Withdraw'],
    status: 'cancelled',
  };
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push({
      ...fake,
      id: (i + 1) + (page * count),
      amount: parseFloat(rand(0.01, 1000000)).toFixed(2),
      type: fake.type[rand(0, fake.type.length - 1)],
    });
  }

  return items;
}

const actionHandlers = {
  [TRANSACTIONS_REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [TRANSACTIONS_SUCCESS]: (state, action) => ({
    ...state,
    data: { ...action.response },
    isLoading: false,
    receivedAt: getTimestamp(),
    page: action.page,
  }),
  [TRANSACTIONS_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
    page: action.page,
    data: {
      ...state.data,
      items: getFakeTransactions(20, action.page),
      hasNext: action.page < 9,
    },
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
