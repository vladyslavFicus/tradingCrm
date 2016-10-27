import { createRequestTypes } from 'utils/redux';
import { getApiRoot } from 'config/index';

const KEY = 'user-files';
const FETCH_FILE = createRequestTypes(`${KEY}/fetch-file`);
const CLEAR_FILES = `${KEY}/clear-files`;

function fetchFile({ fileId, profileId }) {
  return (dispatch, getState) => {
    const { auth: { token } } = getState();

    return fetch(`${getApiRoot()}profile/kyc/${profileId}/download/${fileId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((data) => dispatch({
        type: FETCH_FILE.SUCCESS,
        payload: {
          fileId: fileId,
          content: URL.createObjectURL(data),
        },
      }));
  };
}

function clearFiles() {
  return {
    type: CLEAR_FILES,
  };
}

const initialState = {};

const actionHandlers = {
  [FETCH_FILE.SUCCESS]: (state, action) => ({
    ...state,
    [action.payload.fileId]: action.payload.content,
  }),
  [CLEAR_FILES]: (state, action) => ({
    ...initialState,
  }),
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  FETCH_FILE,
  CLEAR_FILES,
};
const actionCreators = {
  fetchFile,
  clearFiles,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
