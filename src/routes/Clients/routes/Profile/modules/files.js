import { CALL_API } from 'redux-api-middleware';
import fetch from '../../../../../utils/fetch';
import { getApiRoot } from '../../../../../config';
import { actions, categories } from '../../../../../constants/files';
import { sourceActionCreators as filesSourceActionCreators } from '../../../../../redux/modules/profile/files';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import downloadBlob from '../../../../../utils/downloadBlob';
import buildFormData from '../../../../../utils/buildFormData';
import asyncFileUpload from '../../../../../utils/asyncFileUpload';

const KEY = 'user/profile/files';
const FETCH_FILES = createRequestAction(`${KEY}/fetch-files`);
const SAVE_FILES = createRequestAction(`${KEY}/save-files`);
const DOWNLOAD_FILE = createRequestAction(`${KEY}/download-file`);
const VERIFY_FILE = createRequestAction(`${KEY}/verify-file`);
const REFUSE_FILE = createRequestAction(`${KEY}/refuse-file`);
const DELETE_FILE = createRequestAction(`${KEY}/delete-file`);

const fetchFiles = filesSourceActionCreators.fetchFiles(FETCH_FILES);

function saveFiles(playerUUID, data) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/confirm/${playerUUID}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

function uploadProfileFile(playerUUID, type, file) {
  return async (dispatch, getState) => {
    const { auth: { fullName } } = getState();

    const uploadUrl = `${getApiRoot()}/profile/files`;
    const xhr = asyncFileUpload(uploadUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: buildFormData({
        file,
        attachmentAuthor: fullName,
      }),
    });

    const response = await xhr.send();
    const { fileUUID } = response;
    if (fileUUID && file.name) {
      const action = await dispatch(saveFiles(playerUUID, {
        [fileUUID]: {
          name: file.name,
          category: type,
        },
      }));

      if (action && !action.error) {
        return dispatch(fetchFiles(playerUUID, { category: type, size: 999 }));
      }
    }
  };
}

function downloadFile(data) {
  return async (dispatch, getState) => {
    const { auth: { logged } } = getState();

    if (!logged) {
      return dispatch({ type: DOWNLOAD_FILE.FAILURE, payload: new Error('Unauthorized') });
    }

    const requestUrl = `${getApiRoot()}/profile/files/download/${data.uuid}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: data.type,
        'Content-Type': 'application/json',
      },
    });

    const blobData = await response.blob();
    downloadBlob(data.name, blobData);

    return dispatch({ type: DOWNLOAD_FILE.SUCCESS });
  };
}

function deleteFile(playerUUID, fileUUID) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${playerUUID}/${fileUUID}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          DELETE_FILE.REQUEST,
          { type: DELETE_FILE.SUCCESS, meta: { uuid: fileUUID } },
          DELETE_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchFiles(playerUUID, { size: 999 })));
  };
}

const changeFileStatusByAction = filesSourceActionCreators.changeStatusByAction({
  [actions.VERIFY]: VERIFY_FILE,
  [actions.REFUSE]: REFUSE_FILE,
});

const initialState = {
  identity: [],
  address: [],
};

function successUpdateFileStatusReducer(state, action) {
  let field;
  if (action.payload.category === categories.KYC_PERSONAL) {
    field = 'identity';
  } else if (action.payload.category === categories.KYC_ADDRESS) {
    field = 'address';
  }

  if (!field) {
    return state;
  }

  const index = state[field].findIndex(file => file.uuid === action.payload.uuid);

  if (index === -1) {
    return state;
  }

  const newState = {
    ...state,
    [field]: [
      ...state[field],
    ],
  };
  newState[field][index] = action.payload;

  return newState;
}

function successUploadFilesReducer(state, action) {
  const profileFiles = action.payload
    .filter(i => [categories.KYC_PERSONAL, categories.KYC_ADDRESS].indexOf(i.category) > -1);

  if (!profileFiles.length) {
    return state;
  }

  const newState = {
    ...state,
  };

  profileFiles.forEach((file) => {
    if (file.category === categories.KYC_ADDRESS) {
      newState.identity = [
        ...newState.identity,
        file,
      ];
    } else if (file.category === categories.KYC_PERSONAL) {
      newState.address = [
        ...newState.address,
        file,
      ];
    }
  });

  return newState;
}

function successDeleteFileReducer(state, action) {
  if (!action.meta && !action.meta.uuid) {
    return state;
  }

  let shouldUpdateState = false;
  const newState = {
    ...state,
  };

  const identityFileIndex = state.identity.findIndex(file => file.uuid === action.meta.uuid);
  if (identityFileIndex > -1) {
    newState.identity = newState.identity.splice(identityFileIndex, 1);
    shouldUpdateState = true;
  }

  const addressFileIndex = state.address.findIndex(file => file.uuid === action.meta.uuid);
  if (identityFileIndex > -1) {
    newState.address = newState.address.splice(addressFileIndex, 1);
    shouldUpdateState = true;
  }

  return shouldUpdateState ? newState : state;
}

const actionHandlers = {
  [FETCH_FILES.SUCCESS]: (state, action) => {
    if (!action.payload || !action.payload.content) {
      return state;
    }

    const { content } = action.payload;

    return {
      identity: content.filter(file => file.category === categories.KYC_PERSONAL),
      address: content.filter(file => file.category === categories.KYC_ADDRESS),
    };
  },
  [VERIFY_FILE.SUCCESS]: successUpdateFileStatusReducer,
  [REFUSE_FILE.SUCCESS]: successUpdateFileStatusReducer,
  [DELETE_FILE.SUCCESS]: successDeleteFileReducer,
  [SAVE_FILES.SUCCESS]: successUploadFilesReducer,
};
const actionTypes = {
  DOWNLOAD_FILE,
  SAVE_FILES,
  VERIFY_FILE,
  REFUSE_FILE,
  DELETE_FILE,
};
const actionCreators = {
  fetchFiles,
  saveFiles,
  downloadFile,
  deleteFile,
  uploadProfileFile,
  changeFileStatusByAction,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
