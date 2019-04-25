import { CALL_API } from 'redux-api-middleware';
import countries from 'country-list';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../utils/buildQueryString';

const KEY = 'payment-methods';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const DISABLE_LIMIT = createRequestAction(`${KEY}/disable-limit`);
const ENABLE_LIMIT = createRequestAction(`${KEY}/enable-limit`);
const CHANGE_STATUS = createRequestAction(`${KEY}/change-status`);
const CHANGE_LIMIT = createRequestAction(`${KEY}/change-limit`);
const CHANGE_PAYMENT_ORDER = createRequestAction(`${KEY}/change-payment-order`);
const GET_COUNTRY_AVAILABILITY = createRequestAction(`${KEY}/get-country-availability`);

const mapCountries = payload => Object.keys(payload).sort().reduce((result, item) => ({
  ...result,
  [countries().getName(item)]: payload[item],
}), {});

function fetchEntities(filters) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/${limitUUID}/disable`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/${limitUUID}/enable`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/${limitUUID}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

function getCountryAvailability(methodUUID) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/methods/${methodUUID}/availability`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          GET_COUNTRY_AVAILABILITY.REQUEST,
          {
            type: GET_COUNTRY_AVAILABILITY.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => mapCountries(json));
              }
            },
          },
          GET_COUNTRY_AVAILABILITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changePaymentMethodOrder(params) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: '/payment/methods/reorder',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        types: [
          CHANGE_PAYMENT_ORDER.REQUEST,
          CHANGE_PAYMENT_ORDER.SUCCESS,
          CHANGE_PAYMENT_ORDER.FAILURE,
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
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    items: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
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
  getCountryAvailability,
  changePaymentMethodOrder,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
