import { CALL_API } from 'redux-api-middleware';
import { getApiRoot } from '../../../config';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import downloadBlob from '../../../utils/downloadBlob';

const KEY = 'user/files/files';
const SAVE_FILES = createRequestAction(`${KEY}/save-files`);
const DOWNLOAD_FILE = createRequestAction(`${KEY}/download-file`);
const VERIFY_FILE = createRequestAction(`${KEY}/verify-file`);
const REFUSE_FILE = createRequestAction(`${KEY}/refuse-file`);
const DELETE_FILE = createRequestAction(`${KEY}/delete-file`);

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
          { type: DELETE_FILE.SUCCESS, meta: { uuid: fileUUID } },
          DELETE_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {};
const actionHandlers = {};
const actionTypes = {
  DOWNLOAD_FILE,
  SAVE_FILES,
  VERIFY_FILE,
  REFUSE_FILE,
  DELETE_FILE,
};
const actionCreators = {
  saveFiles,
  downloadFile,
  deleteFile,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
