import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actionCreators as noteActionCreators } from '../../../../../redux/modules/note';
import { targetTypes } from '../../../../../constants/note';

const KEY = 'user-payment-accounts';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotesFn = noteActionCreators.fetchNotesByType(FETCH_NOTES);
const mapNotesToPaymentAccounts = (paymentAccounts, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return paymentAccounts;
  }

  return paymentAccounts.map(paymentAccount => ({
    ...paymentAccount,
    note: notes[paymentAccount.uuid] ? notes[paymentAccount.uuid][0] : null,
  }));
};

function fetchEntities(playerUUID, fetchNotes = fetchNotesFn) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `payment/accounts/${playerUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    }).then((action) => {
      if (action && action.type === FETCH_ENTITIES.SUCCESS && action.payload.length) {
        dispatch(fetchNotes(targetTypes.PAYMENT_ACCOUNT, action.payload.map(item => item.uuid)));
      }

      return action;
    });
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
