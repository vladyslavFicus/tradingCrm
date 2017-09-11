import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import _ from 'lodash';
import { getApiRoot } from '../../../../../config/index';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../utils/createRequestAction';
import shallowEqual from '../../../../../utils/shallowEqual';
import downloadBlob from '../../../../../utils/downloadBlob';

const KEY = 'user/feed/feed';
const FETCH_FEED = createRequestAction(`${KEY}/fetch-feed`);
const EXPORT_FEED = createRequestAction(`${KEY}/export-feed`);

const arrayedFilters = ['actionType'];
const mapListArrayValues = (values, fields) => {
  const mapped = { ...values };

  fields.forEach((field) => {
    if (mapped[field] && !Array.isArray(mapped[field])) {
      mapped[field] = [mapped[field]];
    }
  });

  return mapped;
};

function fetchFeed(playerUUID, filters = { page: 0 }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const queryString = buildQueryString(_.omitBy(mapListArrayValues(filters, arrayedFilters), val => !val));
    return dispatch({
      [CALL_API]: {
        endpoint: `/audit/audit/logs/${playerUUID}?${queryString}&sort=creationDate,desc`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_FEED.REQUEST,
            meta: { filters },
          },
          FETCH_FEED.SUCCESS,
          FETCH_FEED.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function exportFeed(playerUUID, filters = { page: 0 }) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_FEED.FAILED });
    }

    const queryString = buildQueryString(_.omitBy(mapListArrayValues(filters, arrayedFilters), val => !val));
    const requestUrl = `${getApiRoot()}/audit/audit/logs/${playerUUID}?${queryString}&sort=creationDate,desc`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const blobData = await response.blob();
    downloadBlob(`player-audit-log-${playerUUID}-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

    return dispatch({ type: EXPORT_FEED.SUCCESS });
  };
}

const mapAuditEntities = entities => entities.map(entity => (typeof entity.details === 'string'
  ? { ...entity, details: JSON.parse(entity.details) }
  : entity));

const actionHandlers = {
  [FETCH_FEED.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
    exporting: state.exporting && shallowEqual(action.meta.filters, state.filters),
    noResults: false,
  }),
  [FETCH_FEED.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.number === 0
        ? mapAuditEntities(action.payload.content)
        : [
          ...state.entities.content,
          ...mapAuditEntities(action.payload.content),
        ],
    },
    isLoading: false,
    receivedAt: timestamp(),
    noResults: action.payload.content.length === 0,
  }),
  [FETCH_FEED.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [EXPORT_FEED.REQUEST]: state => ({
    ...state,
    exporting: true,
  }),
  [EXPORT_FEED.SUCCESS]: state => ({
    ...state,
    exporting: false,
  }),
  [EXPORT_FEED.FAILURE]: state => ({
    ...state,
    exporting: false,
  }),
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
  error: null,
  exporting: false,
  filters: {},
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionTypes = {
  FETCH_FEED,
  EXPORT_FEED,
};
const actionCreators = {
  fetchFeed,
  exportFeed,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
