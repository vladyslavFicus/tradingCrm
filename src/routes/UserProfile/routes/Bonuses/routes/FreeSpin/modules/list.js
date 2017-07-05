import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import moment from 'moment';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import timestamp from '../../../../../../../utils/timestamp';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../redux/modules/note';
import { targetTypes } from '../../../../../../../constants/note';
import { getApiRoot } from '../../../../../../../config';
import downloadBlob from '../../../../../../../utils/downloadBlob';

const KEY = 'user/bonus-free-spin/list';
const RESET_LIST = `${KEY}/reset`;
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const EXPORT_ENTITIES = createRequestAction(`${KEY}/expport-entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotes = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const mapEntities = async (dispatch, pageable) => {
  const uuids = pageable.content.map(item => item.uuid);

  if (!uuids.length) {
    return pageable;
  }

  const newPageable = { ...pageable };

  newPageable.content = newPageable.content.map(item => ({
    ...item,
    spinValue: { amount: item.betPerLine * item.linesPerSpin, currency: item.currencyCode },
    totalValue: { amount: item.betPerLine * item.linesPerSpin * item.freeSpinsAmount, currency: item.currencyCode },
    betPerLine: { amount: item.betPerLine, currency: item.currencyCode },
    prize: item.prize ? { amount: item.prize, currency: item.currencyCode } : null,
    capping: item.capping ? { amount: item.capping, currency: item.currencyCode } : null,
  }));

  const action = await dispatch(fetchNotes(targetTypes.FREE_SPIN, uuids));
  if (!action || action.error) {
    return newPageable;
  }

  return new Promise((resolve) => {
    newPageable.content = newPageable.content.map(item => ({
      ...item,
      note: action.payload[item.uuid] && action.payload[item.uuid].length
        ? action.payload[item.uuid][0]
        : null,
    }));

    return resolve(newPageable);
  });
};

function fetchFreeSpins(filters) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!filters.playerUUID) {
      throw new Error('playerUUID not defined');
    }

    const queryParams = { ...filters };
    delete queryParams.playerUUID;

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin/free-spins/${filters.playerUUID}?${buildQueryString(queryParams)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_ENTITIES.REQUEST,
            meta: { filters },
          },
          {
            type: FETCH_ENTITIES.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');

              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => mapEntities(dispatch, json));
              }
            },
          },
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function exportFreeSpins(filters = {}) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_ENTITIES.FAILED });
    }

    const queryParams = { ...filters, page: undefined, playerUUID: undefined };

    const queryString = buildQueryString(
      _.omitBy(queryParams, val => !val),
    );

    const response = await fetch(`${getApiRoot()}/free_spin/free-spins/${filters.playerUUID}?${queryString}`, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const blobData = await response.blob();
    downloadBlob(`player-free-spins-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

    return dispatch({ type: EXPORT_ENTITIES.SUCCESS });
  };
}

function resetList() {
  return {
    type: RESET_LIST,
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
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
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
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [RESET_LIST]: () => ({ ...initialState }),
};
const actionTypes = {
  RESET_LIST,
  FETCH_ENTITIES,
  FETCH_NOTES,
  EXPORT_ENTITIES,
};
const actionCreators = {
  resetList,
  fetchFreeSpins,
  fetchNotes,
  exportFreeSpins,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
