import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import qs from 'qs';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { getApiRoot } from '../../../../../config';
import exportFile from '../../../../../utils/exportFile';

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
    login: player.login || null,
    kycCompleted: false,
    languageCode: player.languageCode || null,
  } : null,
}));

const fetchNotesFn = noteSourceActionCreators.fetchNotesByTargetUuids(FETCH_NOTES);
const mapNotesToTransactions = (transactions, notes) => {
  if (!notes || notes.length === 0) {
    return transactions;
  }

  return transactions.map(t => ({
    ...t,
    note: notes.find(n => n.targetUUID === t.paymentId) || null,
  }));
};

function fetchEntities(filters = {}, fetchNotes = fetchNotesFn) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const action = await dispatch({
      [CALL_API]: {
        endpoint: `payment_view/payments?${buildQueryString(filters)}`,
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
      await dispatch(fetchNotes(action.payload.content.map(item => item.paymentId)));
    }

    return action;
  };
}

function exportEntities(filters = {}) {
  const queryString = qs.stringify(filters, { delimiter: '&' });
  const type = EXPORT_ENTITIES;
  const endPoint = `${getApiRoot()}/payment/payments?${queryString}`;
  const fileName = `transactions-export-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`;

  return exportFile(type, endPoint, fileName);
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
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? mapTransactions(payload.content)
        : mergeEntities(state.entities.content, mapTransactions(payload.content)),
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
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      content: mapNotesToTransactions(state.entities.content, action.payload.content),
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
  EXPORT_ENTITIES,
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
