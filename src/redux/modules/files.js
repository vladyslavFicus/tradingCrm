import { CALL_API } from 'redux-api-middleware';
import { actions as filesActions } from '../../constants/files';

function verifyFile(type) {
  return uuid => (dispatch, getState) => {
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
  verifyFile,
  refuseFile,
  changeStatusByAction,
};

export {
  sourceActionCreators,
};
