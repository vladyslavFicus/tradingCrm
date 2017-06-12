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
      return dispatch({ type: EXPORT_ACTIVITY.FAILED });
    }

    const queryString = buildQueryString(_.omitBy(mapListArrayValues(filters, arrayedFilters), val => !val));
    const requestUrl = `${getApiRoot()}/gaming_activity/gaming/activity/${playerUUID}?${queryString}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const blobData = await response.blob();
    downloadBlob(`player-game-activity-${playerUUID}-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

    return dispatch({ type: EXPORT_ACTIVITY.SUCCESS });
  };
}

const actionHandlers = {
  [FETCH_ACTIVITY.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
    exporting: state.exporting && shallowEqual(action.meta.filters, state.filters),
  }),
  [FETCH_ACTIVITY.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.number === 0
        ? action.payload.content
        : [
          ...state.entities.content,
          ...action.payload.content,
        ],
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ACTIVITY.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
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
