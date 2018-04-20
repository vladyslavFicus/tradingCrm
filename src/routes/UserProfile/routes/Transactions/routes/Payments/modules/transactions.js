import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../../../constants/note';
import { types as paymentTypes } from '../../../../../../../constants/payment';
import getFingerprint from '../../../../../../../utils/fingerPrint';

const KEY = 'user/payments';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-payments`);
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);
const CHANGE_PAYMENT_STATUS = createRequestAction(`${KEY}/change-payment-status`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const FETCH_PAYMENT_ACCOUNTS = createRequestAction(`${KEY}/fetch-payment-statuses`);
const MANUAL_DEPOSIT = createRequestAction(`${KEY}/manual-deposit`);
const MANUAL_WITHDRAW = createRequestAction(`${KEY}/manual-withdraw`);
const CONFISCATE = createRequestAction(`${KEY}/confiscate`);
const MANAGE_NOTE = `${KEY}/manage-note`;
const RESET_NOTE = `${KEY}/reset-note`;
const RESET_TRANSACTIONS = `${KEY}/reset`;

const fetchPaymentStatuses = paymentSourceActionCreators.fetchPaymentStatuses(FETCH_PAYMENT_STATUSES);
const changePaymentStatus = paymentSourceActionCreators.changePaymentStatus(CHANGE_PAYMENT_STATUS);
const fetchPaymentAccounts = paymentSourceActionCreators.fetchPaymentAccounts(FETCH_PAYMENT_ACCOUNTS);

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

function fetchEntities(playerUUID, filters = {}, fetchNotes = fetchNotesFn) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const action = await dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}?${buildQueryString(filters)}`,
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

    if (action && action.type === FETCH_ENTITIES.SUCCESS && action.payload.content.length) {
      await dispatch(fetchNotes(targetTypes.PAYMENT, action.payload.content.map(item => item.paymentId)));
    }

    return action;
  };
}

function manualDeposit(playerUUID, params) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/deposit/manual`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
        types: [
          MANUAL_DEPOSIT.REQUEST,
          MANUAL_DEPOSIT.SUCCESS,
          MANUAL_DEPOSIT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function manualWithdraw(playerUUID, params) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/withdraw`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
        types: [
          MANUAL_WITHDRAW.REQUEST,
          MANUAL_WITHDRAW.SUCCESS,
          MANUAL_WITHDRAW.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function confiscate(playerUUID, params) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/payments/${playerUUID}/confiscate`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
        types: [
          CONFISCATE.REQUEST,
          CONFISCATE.SUCCESS,
          CONFISCATE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function addPayment(playerUUID, { type, ...inputData }) {
  return async (dispatch) => {
    const data = {
      ...inputData,
      device: await getFingerprint(),
    };

    if (type === paymentTypes.Deposit) {
      return dispatch(manualDeposit(playerUUID, data));
    } else if (type === paymentTypes.Withdraw) {
      return dispatch(manualWithdraw(playerUUID, data));
    } else if (type === paymentTypes.Confiscate) {
      return dispatch(confiscate(playerUUID, data));
    }

    throw new Error(`Unknown payment type "${type}".`);
  };
}

function manageNote(data) {
  return (dispatch, getState) => {
    const { auth: { uuid, fullName } } = getState();

    return dispatch({
      type: MANAGE_NOTE,
      payload: data !== null ? {
        ...data,
        author: fullName,
        creatorUUID: uuid,
        lastEditorUUID: uuid,
      } : data,
    });
  };
}

function resetNote() {
  return {
    type: RESET_NOTE,
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
  newPaymentNote: null,
  noResults: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      ...action.meta.filters,
    },
    isLoading: true,
    isFailed: false,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
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
      content: [
        ...mapNotesToTransactions(state.entities.content, action.payload),
      ],
    },
  }),
  [MANAGE_NOTE]: (state, action) => ({
    ...state,
    newPaymentNote: action.payload,
  }),
  [RESET_NOTE]: state => ({
    ...state,
    newPaymentNote: null,
  }),
  [RESET_TRANSACTIONS]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_PAYMENT_STATUSES,
  CHANGE_PAYMENT_STATUS,
  MANUAL_DEPOSIT,
  MANUAL_WITHDRAW,
  CONFISCATE,
  RESET_TRANSACTIONS,
};
const actionCreators = {
  fetchEntities,
  fetchPaymentStatuses,
  changePaymentStatus,
  fetchPaymentAccounts,
  addPayment,
  manageNote,
  resetNote,
  resetTransactions,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
