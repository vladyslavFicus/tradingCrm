import { CALL_API } from 'redux-api-middleware';
import { getApiRoot } from '../../../../../config';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { actionCreators as noteActionCreators } from '../../../../../redux/modules/note';
import { targetTypes } from '../../../../../constants/note';
import { actions } from '../../../../../constants/files';
import downloadBlob from '../../../../../utils/downloadBlob';

const KEY = 'user/files/files';
const FETCH_FILES = createRequestAction(`${KEY}/fetch-files`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const SAVE_FILES = createRequestAction(`${KEY}/save-files`);
const DOWNLOAD_FILE = createRequestAction(`${KEY}/download-file`);
const VERIFY_FILE = createRequestAction(`${KEY}/verify-file`);
const REFUSE_FILE = createRequestAction(`${KEY}/refuse-file`);
const DELETE_FILE = createRequestAction(`${KEY}/delete-file`);

const fetchNotes = noteActionCreators.fetchNotesByType(FETCH_NOTES);
const mapNotesToFiles = (items, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return items;
  }

  return items.map(item => ({
    ...item,
    note: notes[item.uuid] ? notes[item.uuid][0] : null,
  }));
};

function fetchFiles(playerUUID, filters = { page: 0 }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${playerUUID}?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_FILES.REQUEST,
            meta: { filters },
          },
          FETCH_FILES.SUCCESS,
          FETCH_FILES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchFilesAndNotes(playerUUID, filters, fetchFilesFn = fetchFiles, fetchNotesFn = fetchNotes) {
  return async (dispatch) => {
    const action = await dispatch(fetchFilesFn(playerUUID, filters));

    if (action && !action.error) {
      dispatch(fetchNotesFn(targetTypes.FILE, action.payload.content.map(item => item.uuid)));
    }

    return action;
  };
}

function saveFiles(playerUUID, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/confirm/${playerUUID}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          SAVE_FILES.REQUEST,
          SAVE_FILES.SUCCESS,
          SAVE_FILES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function downloadFile(data) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: DOWNLOAD_FILE.FAILURE, payload: new Error('Unauthorized') });
    }

    const requestUrl = `${getApiRoot()}/profile/files/download/${data.uuid}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: data.type,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const blobData = await response.blob();
    downloadBlob(data.name, blobData);

    return dispatch({ type: DOWNLOAD_FILE.SUCCESS });
  };
}

function deleteFile(playerUUID, fileUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${playerUUID}/${fileUUID}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          DELETE_FILE.REQUEST,
          DELETE_FILE.SUCCESS,
          DELETE_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function verifyFile(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${uuid}/status/verify`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          VERIFY_FILE.REQUEST,
          VERIFY_FILE.SUCCESS,
          VERIFY_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function refuseFile(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${uuid}/status/refuse`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          REFUSE_FILE.REQUEST,
          REFUSE_FILE.SUCCESS,
          REFUSE_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changeStatusByAction(uuid, action) {
  return (dispatch) => {
    switch (action) {
      case actions.VERIFY: {
        return dispatch(verifyFile(uuid));
      }
      case actions.REFUSE: {
        return dispatch(refuseFile(uuid));
      }
      default:
        return null;
    }
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
  [FETCH_FILES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
    isLoading: true,
    error: null,
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
};
const actionTypes = {
  FETCH_FILES,
  DOWNLOAD_FILE,
  VERIFY_FILE,
  REFUSE_FILE,
  DELETE_FILE,
};
const actionCreators = {
  fetchFiles,
  fetchFilesAndNotes,
  saveFiles,
  downloadFile,
  changeStatusByAction,
  deleteFile,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
