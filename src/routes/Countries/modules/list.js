import { CALL_API } from 'redux-api-middleware';
import countries from 'country-list';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import buildQueryString from '../../../utils/buildQueryString';
import { accessTypes } from '../../../constants/countries';

const KEY = 'countries-list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const ALLOW_COUNTRY = createRequestAction(`${KEY}/allow-country`);
const FORBID_COUNTRY = createRequestAction(`${KEY}/disallow-country`);

const mapCountry = item => ({
  ...item,
  countryName: countries().getName(item.countryCode),
});

const mapCountries = payload => payload.map(item => mapCountry(item));

function fetchEntities(filters) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `config_manager/countries?${buildQueryString(filters)}`,
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

function denyCountry(countryCode) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `config_manager/countries/${countryCode}/deny`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          FORBID_COUNTRY.REQUEST,
          FORBID_COUNTRY.SUCCESS,
          FORBID_COUNTRY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function allowCountry(countryCode) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `config_manager/countries/${countryCode}/allow`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          ALLOW_COUNTRY.REQUEST,
          ALLOW_COUNTRY.SUCCESS,
          ALLOW_COUNTRY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changeStatus(action, countryCode) {
  return (dispatch) => {
    if (action === accessTypes.FORBIDDEN) {
      return dispatch(denyCountry(countryCode));
    } else if (action === accessTypes.ALLOWED) {
      return dispatch(allowCountry(countryCode));
    }

    throw new Error(`Unknown status change action "${action}".`);
  };
}

function updateCountryReducer(state, action) {
  const index = state.entities.content.findIndex(item => item.countryCode === action.payload.countryCode);

  if (index === -1) {
    return state;
  }

  const newState = {
    ...state,
    entities: {
      ...state.entities,
      content: [
        ...state.entities.content,
      ],
    },
  };
  newState.entities.content[index] = mapCountry(action.payload);

  return newState;
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? mapCountries(payload.content)
        : [
          ...state.entities.content,
          ...mapCountries(payload.content),
        ],
    },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [ALLOW_COUNTRY.SUCCESS]: updateCountryReducer,
  [FORBID_COUNTRY.SUCCESS]: updateCountryReducer,
};
const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: [],
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  profiles: {},
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
  ALLOW_COUNTRY,
  FORBID_COUNTRY,
};
const actionCreators = {
  fetchEntities,
  changeStatus,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
