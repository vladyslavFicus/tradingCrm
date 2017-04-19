import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../constants/note';

const KEY = 'user-payment-accounts';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotesFn = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const mapNotesToPaymentAccounts = (paymentAccounts, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return paymentAccounts;
  }

  return paymentAccounts.map(paymentAccount => ({
    ...paymentAccount,
    note: notes[paymentAccount.uuid] ? notes[paymentAccount.uuid][0] : null,
  }));
};

const fetchPaymentAccountsFn = paymentSourceActionCreators.fetchPaymentAccounts(FETCH_ENTITIES);

function fetchEntities(playerUUID, fetchNotes = fetchNotesFn, fetchPaymentAccounts = fetchPaymentAccountsFn) {
  return async (dispatch) => {
    const action = await dispatch(fetchPaymentAccounts(playerUUID));

    if (action && action.type === FETCH_ENTITIES.SUCCESS && action.payload.length) {
      await dispatch(fetchNotes(targetTypes.PAYMENT_ACCOUNT, action.payload.map(item => item.uuid)));
    }

    return action;
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    items: action.payload,
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
    items: mapNotesToPaymentAccounts(state.items, action.payload),
  }),
};
const initialState = {
  items: [],
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
