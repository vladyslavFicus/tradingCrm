import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../constants/note';

const KEY = 'transactions/transactions';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);
const CHANGE_PAYMENT_STATUS = createRequestAction(`${KEY}/change-payment-status`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const RESET_TRANSACTIONS = `${KEY}/reset`;

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
    age: moment().diff(player.birthDate, 'years'),
    uuid: player.playerUUID,
    firstName: player.firstName,
    lastName: player.lastName,
    username: player.login,
    kycCompleted: false,
    languageCode: player.languageCode,
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
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: action.meta.filters,
    isLoading: true,
    error: null,
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
  [RESET_TRANSACTIONS]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_PAYMENT_STATUSES,
  CHANGE_PAYMENT_STATUS,
  RESET_TRANSACTIONS,
};
const actionCreators = {
  fetchEntities,
  fetchPaymentStatuses,
  changePaymentStatus,
  resetTransactions,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
