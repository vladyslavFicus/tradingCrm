import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import timestamp from '../../../utils/timestamp';
import createRequestAction from '../../../utils/createRequestAction';
import buildQueryString from '../../../utils/buildQueryString';

const KEY = 'payment-methods';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const DISABLE_LIMIT = createRequestAction(`${KEY}/disable-limit`);
const ENABLE_LIMIT = createRequestAction(`${KEY}/enable-limit`);
const CHANGE_STATUS = createRequestAction(`${KEY}/change-status`);
const CHANGE_LIMIT = createRequestAction(`${KEY}/change-limit`);

function fetchEntities(filters) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods?${buildQueryString(filters)}`,
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

function disableLimit(methodUUID, limitUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/${limitUUID}/disable`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          DISABLE_LIMIT.REQUEST,
          DISABLE_LIMIT.SUCCESS,
          DISABLE_LIMIT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function enableLimit(methodUUID, limitUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/${limitUUID}/enable`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          ENABLE_LIMIT.REQUEST,
          ENABLE_LIMIT.SUCCESS,
          ENABLE_LIMIT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changeStatus(methodUUID, status) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
        types: [
          CHANGE_STATUS.REQUEST,
          CHANGE_STATUS.SUCCESS,
          CHANGE_STATUS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changeLimit(methodUUID, limitUUID, params) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/${limitUUID}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
        types: [
          CHANGE_LIMIT.REQUEST,
          CHANGE_LIMIT.SUCCESS,
          CHANGE_LIMIT.FAILURE,
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
    items: action.payload,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const initialState = {
  items: [],
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
  DISABLE_LIMIT,
  ENABLE_LIMIT,
};
const actionCreators = {
  fetchEntities,
  disableLimit,
  enableLimit,
  changeStatus,
  changeLimit,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
