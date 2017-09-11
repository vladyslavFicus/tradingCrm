import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import _ from 'lodash';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../constants/note';
import { getApiRoot } from '../../../../../config';
import downloadBlob from '../../../../../utils/downloadBlob';

const KEY = 'transactions/transactions';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);
const CHANGE_PAYMENT_STATUS = createRequestAction(`${KEY}/change-payment-status`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const RESET_TRANSACTIONS = `${KEY}/reset`;
const EXPORT_ENTITIES = createRequestAction(`${KEY}/export-entities`);

const fetchPaymentStatuses = paymentSourceActionCreators.fetchPaymentStatuses(FETCH_PAYMENT_STATUSES);
const changePaymentStatus = paymentSourceActionCreators.changePaymentStatus(CHANGE_PAYMENT_STATUS);

const mergeEntities = (stored, fetched) => {
  const merged = [...stored];

  fetched.forEach((item) => {
    if (merged.findIndex(i => i.paymentId === item.paymentId) === -1) {
      merged.push(item);
    }
  });

  return merged;
};

const mapTransactions = transactions => transactions.map(({ player, ...transaction }) => ({
  ...transaction,
  playerProfile: player ? {
    age: player.birthDate ? moment().diff(player.birthDate, 'years') : null,
    playerUUID: player.playerUUID,
    firstName: player.firstName || null,
    lastName: player.lastName || null,
    username: player.login || null,
    kycCompleted: false,
    languageCode: player.languageCode || null,
  } : null,
}));

const fetchNotesFn = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const mapNotesToTransactions = (transactions, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return transactions;
  }

  return transactions.map(t => ({
    ...t,
    note: notes[t.paymentId] ? notes[t.paymentId][0] : null,
  }));
};

function fetchEntities(filters = {}, fetchNotes = fetchNotesFn) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const action = await dispatch({
      [CALL_API]: {
        endpoint: `payment/payments?${buildQueryString(filters)}`,
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
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });

    if (action && !action.error && action.payload.content.length) {
      await dispatch(fetchNotes(targetTypes.PAYMENT, action.payload.content.map(item => item.paymentId)));
    }

    return action;
  };
}

function exportEntities(filters = {}) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_ENTITIES.FAILED });
    }

    const queryString = buildQueryString(
      _.omitBy({ page: 0, ...filters }, val => !val)
    );

    const response = await fetch(`${getApiRoot()}/payment/payments?${queryString}`, {
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
  };
}

function resetTransactions() {
  return {
    type: RESET_TRANSACTIONS,
  };
}

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
  filters: {},
  isLoading: false,
  receivedAt: null,
  noResults: false,
  exporting: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: action.meta.filters,
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.number === 0
        ? mapTransactions(action.payload.content)
        : mergeEntities(state.entities.content, mapTransactions(action.payload.content)),
    },
    isLoading: false,
    receivedAt: timestamp(),
    noResults: action.payload.content.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      content: mapNotesToTransactions(state.entities.content, action.payload),
    },
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
  [RESET_TRANSACTIONS]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_PAYMENT_STATUSES,
  CHANGE_PAYMENT_STATUS,
  RESET_TRANSACTIONS,
  EXPORT_ENTITIES
};
const actionCreators = {
  fetchEntities,
  fetchPaymentStatuses,
  changePaymentStatus,
  resetTransactions,
  exportEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
