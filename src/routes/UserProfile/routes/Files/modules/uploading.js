import { v4 } from 'uuid';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildFormData from '../../../../../utils/buildFormData';
import asyncFileUpload from '../../../../../utils/asyncFileUpload';
import { getApiRoot } from '../../../../../config';

const KEY = 'user/files/uploading';
const UPLOAD_FILE = createRequestAction(`${KEY}/upload-file`);
const CANCEL_FILE = `${KEY}/cancel-file`;
const PROGRESS = `${KEY}/progress`;
const RESET = `${KEY}/reset`;

function updateProgress(id, progress) {
  return {
    type: PROGRESS,
    meta: { id },
    payload: parseInt(progress, 10),
  };
}

function uploadFile(file, errors) {
  return async (dispatch, getState) => {
    const { auth: { token, fullName } } = getState();
    const id = v4();

    if (errors && errors.length) {
      dispatch({ type: UPLOAD_FILE.REQUEST, payload: { id, file } });
      dispatch({ type: UPLOAD_FILE.FAILURE, payload: errors[0] });
    }

    try {
      const uploadUrl = `${getApiRoot()}/profile/files`;
      const xhr = asyncFileUpload(uploadUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: buildFormData({ file, attachmentAuthor: fullName }),
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
      return dispatch({ type: UPLOAD_FILE.FAILURE, meta: { id }, payload: e.message });
    }
  };
}

function cancelFile(file) {
  return {
    type: CANCEL_FILE,
    payload: file,
  };
}

function resetUploading() {
  return {
    type: RESET,
  };
}

const initialState = {
  noname: {
    error: null,
    progress: 100,
    uploading: false,
    note: null,
    file: {
      name: 'asdjhjashdhasdkhjasjdlsad ads dasd asdasd-.jpg',
      size: 1231432431,
    },
  },
};
const actionHandlers = {
  [UPLOAD_FILE.REQUEST]: (state, action) => ({
    ...state,
    [action.payload.id]: ({
      ...action.payload,
      error: null,
      uploading: false,
      progress: 0,
      note: null,
    }),
  }),
  [UPLOAD_FILE.SUCCESS]: (state, action) => {
    if (state[action.meta.id]) {
      return {
        ...state,
        [action.meta.id]: {
          ...state[action.meta.id],
          ...action.payload,
          progress: 100,
          uploading: false,
        },
      };
    }

    return state;
  },
  [UPLOAD_FILE.FAILURE]: (state, action) => {
    if (state[action.meta.id]) {
      return {
        ...state,
        [action.meta.id]: {
          ...state[action.meta.id],
          error: action.payload,
          uploading: false,
        },
      };
    }

    return state;
  },
  [PROGRESS]: (state, action) => {
    if (state[action.meta.id]) {
      return {
        ...state,
        [action.meta.id]: {
          ...state[action.meta.id],
          progress: action.payload,
        },
      };
    }

    return state;
  },
  [CANCEL_FILE]: (state, action) => {
    if (state[action.payload.id]) {
      const newState = {
        ...state,
      };
      const fileState = newState[action.payload.id];

      if (fileState.uploading && fileState.xhr) {
        fileState.xhr.abort();
      }
      delete newState[action.payload.id];

      return newState;
    }

    return state;
  },
  [RESET]: () => ({ ...initialState }),
};
const actionTypes = {
  UPLOAD_FILE,
  PROGRESS,
  RESET,
};
const actionCreators = {
  uploadFile,
  cancelFile,
  updateProgress,
  resetUploading,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
