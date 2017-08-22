import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import { targetTypes } from '../../../../../constants/note';
import { actions as filesActions } from '../../../../../constants/files';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as filesSourceActionCreators } from '../../../../../redux/modules/files';

const KEY = 'user/files/files';
const FETCH_FILES = createRequestAction(`${KEY}/fetch-files`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const VERIFY_FILE = createRequestAction(`${KEY}/verify-file`);
const REFUSE_FILE = createRequestAction(`${KEY}/refuse-file`);

const fetchNotes = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const changeFileStatusByAction = filesSourceActionCreators.changeStatusByAction({
  [filesActions.VERIFY]: VERIFY_FILE,
  [filesActions.REFUSE]: REFUSE_FILE,
});
const mapNotesToFiles = (items, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return items;
  }

  return items.map(item => ({
    ...item,
    note: notes[item.uuid] ? notes[item.uuid][0] : null,
  }));
};

const fetchFiles = filesSourceActionCreators.fetchFiles(FETCH_FILES);

function fetchFilesAndNotes(playerUUID, filters, fetchFilesFn = fetchFiles, fetchNotesFn = fetchNotes) {
  return async (dispatch) => {
    const action = await dispatch(fetchFilesFn(playerUUID, filters));

    if (action && !action.error) {
      dispatch(fetchNotesFn(targetTypes.FILE, action.payload.content.map(item => item.uuid)));
    }

    return action;
  };
}

function updateFileStatusReducer(state, action) {
  const index = state.entities.content.findIndex(file => file.uuid === action.payload.uuid);

  if (index === -1) {
    return state;
  }

  const newState = {
    ...state,
    entities: {
      ...state.entities,
      content: [
        ...state.entities.content,
      ],
    },
  };
  newState.entities.content[index] = { ...newState.entities.content[index], ...action.payload };

  return newState;
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
};
const actionHandlers = {
  [FETCH_FILES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_FILES.SUCCESS]: (state, action) => ({
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
    noResults: action.payload.content.length === 0,
  }),
  [FETCH_FILES.FAILURE]: (state, action) => ({
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
        ...mapNotesToFiles(state.entities.content, action.payload),
      ],
    },
  }),
  [VERIFY_FILE.SUCCESS]: updateFileStatusReducer,
  [REFUSE_FILE.SUCCESS]: updateFileStatusReducer,
};
const actionTypes = {
  FETCH_FILES,
  FETCH_NOTES,
  VERIFY_FILE,
  REFUSE_FILE,
};
const actionCreators = {
  fetchFiles,
  fetchFilesAndNotes,
  changeFileStatusByAction,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
