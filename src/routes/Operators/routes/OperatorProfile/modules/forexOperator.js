import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import createReducer from 'utils/createReducer';

const KEY = 'forex-operator';
const FETCH_FOREX_OPERATOR = createRequestAction(`${KEY}/operator[GET]`);
const CREATE_FOREX_OPERATOR = createRequestAction(`${KEY}/operator[POST]`);
const UPDATE_FOREX_OPERATOR = createRequestAction(`${KEY}/operator[PUT]`);


const successFetchOperatorReducer = (state, { payload, meta: { endRequestTime } }) => ({
  ...state,
  data: payload || state.data,
  isLoading: false,
  receivedAt: endRequestTime,
});

function fetchForexOperator(operatorUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `forex_operator/operator/${operatorUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_FOREX_OPERATOR.REQUEST,
          FETCH_FOREX_OPERATOR.SUCCESS,
          FETCH_FOREX_OPERATOR.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function createForexOperator(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'forex_operator/operator',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CREATE_FOREX_OPERATOR.REQUEST,
          CREATE_FOREX_OPERATOR.SUCCESS,
          CREATE_FOREX_OPERATOR.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function updateForexOperator(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'forex_operator/operator',
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          UPDATE_FOREX_OPERATOR.REQUEST,
          UPDATE_FOREX_OPERATOR.SUCCESS,
          UPDATE_FOREX_OPERATOR.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: {
    permission: {
      allowedIpAddresses: [],
      forbiddenCountries: [],
    },
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

const actionHandlers = {
  [FETCH_FOREX_OPERATOR.REQUEST]: () => ({
    ...initialState,
    isLoading: true,
    error: null,
  }),
  [FETCH_FOREX_OPERATOR.SUCCESS]: successFetchOperatorReducer,
  [FETCH_FOREX_OPERATOR.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [CREATE_FOREX_OPERATOR.SUCCESS]: successFetchOperatorReducer,
  [UPDATE_FOREX_OPERATOR.SUCCESS]: successFetchOperatorReducer,
};

const actionCreators = {
  fetchForexOperator,
  updateForexOperator,
  createForexOperator,
};

const actionTypes = {
  FETCH_FOREX_OPERATOR,
  CREATE_FOREX_OPERATOR,
  UPDATE_FOREX_OPERATOR,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
