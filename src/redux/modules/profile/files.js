import { CALL_API } from 'redux-api-middleware';
import { actions as filesActions } from '../../../constants/files';
import buildQueryString from '../../../utils/buildQueryString';

function fetchFiles(type) {
  return (playerUUID, filters = { page: 0 }) => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${playerUUID}?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          {
            type: type.REQUEST,
            meta: { filters },
          },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function verifyFile(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${uuid}/status/verify`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function refuseFile(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${uuid}/status/refuse`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changeStatusByAction(types) {
  return (uuid, action) => (dispatch) => {
    switch (action) {
      case filesActions.VERIFY: {
        return dispatch(verifyFile(types[action])(uuid));
      }
      case filesActions.REFUSE: {
        return dispatch(refuseFile(types[action])(uuid));
      }
      default:
        return null;
    }
  };
}

const sourceActionCreators = {
  fetchFiles,
  verifyFile,
  refuseFile,
  changeStatusByAction,
};

export {
  sourceActionCreators,
};
