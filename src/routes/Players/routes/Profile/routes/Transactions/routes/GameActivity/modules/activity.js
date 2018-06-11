import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import _ from 'lodash';
import fetch from '../../../../../../../../../utils/fetch';
import { getApiRoot } from '../../../../../../../../../config';
import createReducer from '../../../../../../../../../utils/createReducer';
import buildQueryString from '../../../../../../../../../utils/buildQueryString';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';
import shallowEqual from '../../../../../../../../../utils/shallowEqual';
import downloadBlob from '../../../../../../../../../utils/downloadBlob';

const KEY = 'user/game-activity/activity';
const FETCH_ACTIVITY = createRequestAction(`${KEY}/fetch-activity`);
const EXPORT_ACTIVITY = createRequestAction(`${KEY}/export-activity`);

const arrayedFilters = ['aggregators', 'providers', 'games', 'gameTypes', 'betTypes', 'winTypes'];
const mapListArrayValues = (values, fields) => {
  const mapped = { ...values };

  fields.forEach((field) => {
    if (mapped[field] && !Array.isArray(mapped[field])) {
      mapped[field] = [mapped[field]];
    }
  });

  return mapped;
};

function fetchGameActivity(playerUUID, filters = { page: 0 }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const queryString = buildQueryString(_.omitBy(mapListArrayValues(filters, arrayedFilters), val => !val));
    return dispatch({
      [CALL_API]: {
        endpoint: `/gaming_activity/gaming/activity/${playerUUID}?${queryString}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_ACTIVITY.REQUEST,
            meta: { filters },
          },
          FETCH_ACTIVITY.SUCCESS,
          FETCH_ACTIVITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function exportGameActivity(playerUUID, filters = { page: 0 }) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_ACTIVITY.FAILURE, error: true });
    }

    const queryString = buildQueryString(_.omitBy(mapListArrayValues(filters, arrayedFilters), val => !val));
    const requestUrl = `${getApiRoot()}/gaming_activity/gaming/activity/${playerUUID}?${queryString}`;
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Accept: 'text/csv, application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const blobData = await response.blob();
      downloadBlob(`player-game-activity-${playerUUID}-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

      return dispatch({ type: EXPORT_ACTIVITY.SUCCESS });
    } catch (payload) {
      return dispatch({ type: EXPORT_ACTIVITY.FAILURE, error: true, payload });
    }
  };
}

const actionHandlers = {
  [FETCH_ACTIVITY.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
    exporting: state.exporting && shallowEqual(action.meta.filters, state.filters),
    noResults: false,
  }),
  [FETCH_ACTIVITY.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? payload.content
        : [
          ...state.entities.content,
          ...payload.content,
        ],
    },
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.content.length === 0,
  }),
  [FETCH_ACTIVITY.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [EXPORT_ACTIVITY.REQUEST]: state => ({
    ...state,
    exporting: true,
  }),
  [EXPORT_ACTIVITY.SUCCESS]: state => ({
    ...state,
    exporting: false,
  }),
  [EXPORT_ACTIVITY.FAILURE]: state => ({
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
  FETCH_ACTIVITY,
  EXPORT_ACTIVITY,
};
const actionCreators = {
  fetchGameActivity,
  exportGameActivity,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
