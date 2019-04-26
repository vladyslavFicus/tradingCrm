import { v4 } from 'uuid';
import fetch from '../../../../../utils/fetch';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildFormData from '../../../../../utils/buildFormData';
import downloadBlob from '../../../../../utils/downloadBlob';
import { getApiRoot, getBrandId } from '../../../../../config';
import asyncFileUpload from '../../../../../utils/asyncFileUpload';
import buildQueryString from '../../../../../utils/buildQueryString';

const KEY = 'games/list/files';
const UPLOAD_FILE = createRequestAction(`${KEY}/upload-file`);
const PROGRESS = `${KEY}/upload-progress`;
const DOWNLOAD_FILE = createRequestAction(`${KEY}/download-file`);
const CLEAR_FILES = `${KEY}/clear-files`;

function updateProgress(id, progress) {
  return {
    type: PROGRESS,
    meta: { id },
    payload: parseInt(progress, 10),
  };
}

function uploadFile(file, aggregatorId = '', errors = []) {
  return async (dispatch) => {
    const id = v4();

    if (errors && errors.length) {
      dispatch({ type: UPLOAD_FILE.REQUEST, payload: { id, file } });
      return dispatch({ type: UPLOAD_FILE.FAILURE, payload: errors[0], meta: { id } });
    }

    try {
      const uploadUrl = `${getApiRoot()}/game_info/games?${buildQueryString({ brandId: getBrandId(), aggregatorId })}`;
      const xhr = asyncFileUpload(uploadUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
        body: buildFormData({ file }),
        onprogress: (e) => {
          dispatch(updateProgress(id, (e.loaded / e.total) * 100));
        },
      });

      dispatch({ type: UPLOAD_FILE.REQUEST, payload: { id, file, xhr } });

      const response = await xhr.send();

      return dispatch({
        type: UPLOAD_FILE.SUCCESS,
        meta: { id },
        payload: response,
      });
    } catch (e) {
      return dispatch({ type: UPLOAD_FILE.FAILURE, error: true, meta: { id }, payload: e.message });
    }
  };
}

function downloadFile(name = 'games.csv') {
  return async (dispatch, getState) => {
    const { auth: { logged } } = getState();

    dispatch({ type: DOWNLOAD_FILE.REQUEST });

    if (!logged) {
      return dispatch({ type: DOWNLOAD_FILE.FAILURE, payload: new Error('Unauthorized') });
    }

    const requestUrl = `${getApiRoot()}/game_info/games`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
      },
    });

    const blobData = await response.blob();
    downloadBlob(name, blobData);

    return dispatch({ type: DOWNLOAD_FILE.SUCCESS });
  };
}

function clearFiles() {
  return {
    type: CLEAR_FILES,
  };
}

const initialState = {
  download: {
    error: null,
    loading: false,
  },
  upload: {
    error: null,
    uploading: false,
    progress: 0,
  },
};
const actionHandlers = {
  [UPLOAD_FILE.REQUEST]: (state, action) => ({
    ...state,
    upload: ({
      ...action.payload,
      error: null,
      uploading: false,
      progress: 0,
    }),
  }),
  [UPLOAD_FILE.SUCCESS]: state => ({
    ...state,
    upload: {
      ...state.upload,
      progress: 100,
      uploading: false,
    },
  }),
  [UPLOAD_FILE.FAILURE]: (state, action) => ({
    ...state,
    upload: {
      ...state.upload,
      error: action.payload,
      uploading: false,
    },
  }),
  [PROGRESS]: (state, action) => ({
    ...state,
    upload: {
      ...state.upload,
      progress: action.payload,
    },
  }),
  [DOWNLOAD_FILE.REQUEST]: state => ({
    ...state,
    download: {
      loading: true,
      error: null,
    },
  }),
  [DOWNLOAD_FILE.SUCCESS]: state => ({
    ...state,
    download: {
      loading: false,
    },
  }),
  [DOWNLOAD_FILE.FAILURE]: (state, action) => ({
    ...state,
    download: {
      loading: false,
      error: action.payload,
    },
  }),
  [CLEAR_FILES]: () => ({ ...initialState }),
};
const actionTypes = {
  UPLOAD_FILE,
  DOWNLOAD_FILE,
  CLEAR_FILES,
};
const actionCreators = {
  uploadFile,
  downloadFile,
  clearFiles,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
