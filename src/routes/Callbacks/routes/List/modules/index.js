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
const UPDATE_ENTITY = createRequestAction(`${KEY}/update-entity`);
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

function updateEntity(data) {
  return async (dispatch, getState) => {
    const {auth: {token}} = getState();
    return fetch(`/api/trading_callback/${data.callbackId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    }).then(data => {
      return data.status && data.status === 200
        ? dispatch({type: UPDATE_ENTITY.SUCCESS, payload: 'ok'})
        : dispatch({type: UPDATE_ENTITY.FAILURE, payload: data});
    });
  };
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
      downloadBlob(`callbacks-export-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

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
  updateEntity,
  reset,
};

export {
  actionCreators,
  actionTypes,
  initialState,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
