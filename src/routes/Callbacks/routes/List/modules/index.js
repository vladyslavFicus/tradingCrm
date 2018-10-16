import moment from 'moment';
import _ from 'lodash';
import { CALL_API } from 'redux-api-middleware';
import fetch from '../../../../../utils/fetch';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { getApiRoot } from '../../../../../config/index';
import buildQueryString from '../../../../../utils/buildQueryString';
import downloadBlob from '../../../../../utils/downloadBlob';
import shallowEqual from '../../../../../utils/shallowEqual';

const KEY = 'callbacks';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const EXPORT_ENTITIES = createRequestAction(`${KEY}/export-entities`);
const RESET = `${KEY}/reset`;

function reset() {
  return {
    type: RESET,
  };
}

function fetchEntities(filters={}) {
  return (dispatch, getState) => {
    const { auth: { token } } = getState();
    const queryString = buildQueryString(
      _.omitBy({ page: 0, ...filters }, val => !val)
    );
    return dispatch({
      [CALL_API]: {
        endpoint: `/trading_callback/?${queryString}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
      },
    })}
}

function exportEntities(filters = {}) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_ENTITIES.FAILURE, error: true });
    }

    const queryString = buildQueryString(
      _.omitBy({ page: 0, ...filters }, val => !val)
    );

    try {
      const response = await fetch(`${getApiRoot()}/trading_callback/?${queryString}`, {
        method: 'GET',
        headers: {
          Accept: 'text/csv',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const blobData = await response.blob();
      downloadBlob(`users-export-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

      return dispatch({ type: EXPORT_ENTITIES.SUCCESS });
    } catch (payload) {
      return dispatch({ type: EXPORT_ENTITIES.FAILURE, error: true, payload });
    }
  };
}

const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  filters: {},
  isLoading: false,
  error: null,
  receivedAt: null,
  exporting: false,
  noResults: false,
};

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
    exporting: state.exporting && shallowEqual(action.meta.filters, state.filters),
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      // content: payload.number === 0
      //   ? payload.content.map(mapProfile)
      //   : [
      //     ...state.entities.content,
      //     ...payload.content.map(mapProfile),
      //   ],
    },
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.content.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [EXPORT_ENTITIES.REQUEST]: state => ({
    ...state,
    exporting: true,
  }),
  [EXPORT_ENTITIES.SUCCESS]: state => ({
    ...state,
    exporting: false,
  }),
  [EXPORT_ENTITIES.FAILURE]: state => ({
    ...state,
    exporting: false,
  }),
  [RESET]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  EXPORT_ENTITIES,
  RESET,
};
const actionCreators = {
  fetchEntities,
  exportEntities,
  reset,
};

export {
  actionCreators,
  actionTypes,
  initialState,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
