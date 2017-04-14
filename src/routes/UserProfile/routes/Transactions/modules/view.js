import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../constants/note';

const KEY = 'user/payments';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-payments`);
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);
const CHANGE_PAYMENT_STATUS = createRequestAction(`${KEY}/change-payment-status`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const MANUAL_DEPOSIT = createRequestAction(`${KEY}/manual-deposit`);
const MANUAL_WITHDRAW = createRequestAction(`${KEY}/manual-withdraw`);
const CONFISCATE = createRequestAction(`${KEY}/confiscate`);

const fetchPaymentStatuses = paymentSourceActionCreators.fetchPaymentStatuses(FETCH_PAYMENT_STATUSES);
const changePaymentStatus = paymentSourceActionCreators.changePaymentStatus(CHANGE_PAYMENT_STATUS);

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

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      ...action.meta.filters,
    },
    isLoading: true,
    isFailed: false,
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
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      content: [
        ...mapNotesToTransactions(state.entities.content, action.payload),
      ],
    },
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
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_PAYMENT_STATUSES,
  CHANGE_PAYMENT_STATUS,
  MANUAL_DEPOSIT,
  MANUAL_WITHDRAW,
  CONFISCATE,
};

const actionCreators = {
  fetchEntities,
  fetchPaymentStatuses,
  changePaymentStatus,
  manualDeposit,
  manualWithdraw,
  confiscate,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
