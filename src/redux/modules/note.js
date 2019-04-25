import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../utils/createRequestAction';
import buildQueryString from '../../utils/buildQueryString';

const KEY = 'common/note';
const ADD_NOTE = createRequestAction(`${KEY}/add`);
const EDIT_NOTE = createRequestAction(`${KEY}/edit`);
const DELETE_NOTE = createRequestAction(`${KEY}/delete`);

function fetchNotesByTargetUuids(type) {
  return targetUUID => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `tag/note/search?${buildQueryString({ targetUUID })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged || !targetUUID.length,
      },
    });
  };
}

function addNote(type) {
  return ({ content, pinned, targetUUID }) => (dispatch, getState) => {
    const {
      auth: { logged },
    } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'tag/note',
        method: 'POST',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targets: [
            {
              targetUuid: targetUUID,
              pinned,
            },
          ],
        }),
        bailout: !logged,
      },
    });
  };
}

function editNote(type) {
  return (_, { noteId, targetUUID, content, pinned }) => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `tag/note/${noteId}`,
        method: 'PUT',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUUID,
          content,
          pinned,
        }),
        bailout: !logged,
      },
    });
  };
}

function deleteNote(type) {
  return id => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `tag/${id}`,
        method: 'DELETE',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        bailout: !logged,
      },
    });
  };
}

const actionTypes = {
  ADD_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
};
const actionCreators = {
  addNote: addNote(ADD_NOTE),
  editNote: editNote(EDIT_NOTE),
  deleteNote: deleteNote(DELETE_NOTE),
};
const sourceActionCreators = {
  fetchNotesByTargetUuids,
  addNote,
  editNote,
  deleteNote,
};

export {
  actionTypes,
  actionCreators,
  sourceActionCreators,
};
