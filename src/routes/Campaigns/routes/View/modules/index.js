import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildFormData from '../../../../../utils/buildFormData';

const KEY = 'campaign/view';
const UPLOAD_PLAYERS_FILE = createRequestAction(`${KEY}/upload-file`);
const UPLOAD_RESET_PLAYERS_FILE = createRequestAction(`${KEY}/upload-reset-file`);

function uploadPlayersFile(uuid, file) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/campaign/${uuid}/player-list`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: buildFormData({ file }),
        types: [
          {
            type: UPLOAD_PLAYERS_FILE.REQUEST,
            payload: { file },
          },
          UPLOAD_PLAYERS_FILE.SUCCESS,
          UPLOAD_PLAYERS_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function uploadResetPlayersFile(uuid, file) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/campaign/${uuid}/reset-player-states`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: buildFormData({ file }),
        types: [
          {
            type: UPLOAD_RESET_PLAYERS_FILE.REQUEST,
            payload: { file },
          },
          UPLOAD_RESET_PLAYERS_FILE.SUCCESS,
          UPLOAD_RESET_PLAYERS_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionTypes = {
  UPLOAD_PLAYERS_FILE,
  UPLOAD_RESET_PLAYERS_FILE,
};
const actionCreators = {
  uploadPlayersFile,
  uploadResetPlayersFile,
};

export {
  actionTypes,
  actionCreators,
};
