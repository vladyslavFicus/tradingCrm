import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';

const KEY = 'transactions/filters';
const FETCH_FILTERS = createRequestAction(`${KEY}/fetch-filters`);

function fetchFilters() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/methods`,
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
    statuses: {
      PENDING: 'Pending',
      REFUSED: 'Refused',
      FAILED: 'Failed',
      COMPLETED: 'Completed',
      CHARGEBACK: 'Chargeback',
    },
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
  [FETCH_FILTERS.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      paymentMethods: action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_FILTERS.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
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
