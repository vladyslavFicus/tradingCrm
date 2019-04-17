import { CALL_API } from 'redux-api-middleware';
import createReducer from 'utils/createReducer';
import createRequestAction from 'utils/createRequestAction';
import { statuses } from 'constants/payment';

const KEY = 'transactions/filters';
const FETCH_FILTERS = createRequestAction(`${KEY}/fetch-filters`);

function fetchFilters(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/accounts/${playerUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [FETCH_FILTERS.REQUEST, FETCH_FILTERS.SUCCESS, FETCH_FILTERS.FAILURE],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: {
    paymentMethods: [],
    statuses: [
      statuses.PENDING,
      statuses.REFUSED,
      statuses.FAILED,
      statuses.COMPLETED,
      statuses.CHARGEBACK,
    ],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_FILTERS.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_FILTERS.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: {
      ...state.data,
      paymentMethods: payload
        .map(paymentAccount => paymentAccount.paymentMethod)
        .filter((value, index, self) => self.indexOf(value) === index),
    },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_FILTERS.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const actionTypes = {
  FETCH_FILTERS,
};
const actionCreators = {
  fetchFilters,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
