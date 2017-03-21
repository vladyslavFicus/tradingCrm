import createReducer from 'utils/createReducer';
import { actionCreators as noteActionCreators } from 'redux/modules/note';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'user/notes';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-notes`);
const ADD_NOTE = createRequestAction(`${KEY}/add-note`);
const EDIT_NOTE = createRequestAction(`${KEY}/edit-note`);
const DELETE_NOTE = createRequestAction(`${KEY}/delete-note`);

const fetchNotes = noteActionCreators.fetchNotes(FETCH_ENTITIES);
const addNote = noteActionCreators.addNote(ADD_NOTE);
const editNote = noteActionCreators.editNote(EDIT_NOTE);
const deleteNote = noteActionCreators.deleteNote(DELETE_NOTE);

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.meta.filters },
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
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
};
const actionCreators = {
  fetchNotes,
  addNote,
  editNote,
  deleteNote,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
