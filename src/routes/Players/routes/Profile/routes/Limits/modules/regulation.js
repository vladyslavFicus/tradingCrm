import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import { types } from '../../../../../../../constants/limits';
import { sourceActionCreators as paymentActionCreators } from '../../../../../../../redux/modules/payment';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../redux/modules/note';

const KEY = 'player-limits';
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const FETCH_REGULATION_LIMIT = createRequestAction(`${KEY}/fetch-regulation-limit`);
const CANCEL_REGULATION_LIMIT = createRequestAction(`${KEY}/cancel-regulation-limit`);

const cancelRegulationLimit = paymentActionCreators.cancelDepositLimit(CANCEL_REGULATION_LIMIT);
const fetchNotesFn = noteSourceActionCreators.fetchNotesByTargetUuids(FETCH_NOTES);

const mapNotesToLimits = (limits, notes) => {
  if (!notes || notes.length === 0) {
    return limits;
  }

  return limits.map(limit => ({
    ...limit,
    note: notes.find(n => n.targetUUID === limit.uuid) || null,
  }));
};

const mapLimits = ({ status, ...item }) => ({
  ...item,
  type: types.REGULATION,
  status: status.slice(0, status.indexOf('_')),
});

function fetchRegulationLimit(playerUUID, fetchNotes = fetchNotesFn) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/limits/${playerUUID}/regulation`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_REGULATION_LIMIT.REQUEST,
          FETCH_REGULATION_LIMIT.SUCCESS,
          FETCH_REGULATION_LIMIT.FAILURE,
        ],
        bailout: !logged,
      },
    }).then((action) => {
      if (action.payload.length) {
        dispatch(fetchNotes(action.payload.map(item => item.uuid)));
      }
    });
  };
}

const initialState = {
  list: [],
};

const actionHandlers = {
  [FETCH_REGULATION_LIMIT.SUCCESS]: (state, action) => ({
    ...state,
    list: action.payload.map(i => mapLimits(i)),
  }),
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    list: mapNotesToLimits(state.list, action.payload.content),
  }),
};

const actionTypes = {
  FETCH_REGULATION_LIMIT,
};

const actionCreators = {
  fetchRegulationLimit,
  cancelRegulationLimit,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);

