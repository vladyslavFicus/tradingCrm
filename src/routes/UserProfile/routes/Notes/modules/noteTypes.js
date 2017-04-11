import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';

const KEY = 'user/notes/target-types';
const FETCH_NOTE_TYPES = createRequestAction(`${KEY}/fetch-note-types`);

function fetchNoteTypes() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: '/note/notes/info/targetTypes',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_NOTE_TYPES.REQUEST,
          FETCH_NOTE_TYPES.SUCCESS,
          FETCH_NOTE_TYPES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_NOTE_TYPES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_NOTE_TYPES.SUCCESS]: (state, action) => ({
    ...state,
    data: Object.values(action.payload),
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_NOTE_TYPES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const actionTypes = {
  FETCH_NOTE_TYPES,
};
const actionCreators = {
  fetchNoteTypes,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
