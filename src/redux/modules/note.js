import { CALL_API } from 'redux-api-middleware';
import buildQueryString from '../../utils/buildQueryString';
import createRequestAction from '../../utils/createRequestAction';

const KEY = 'common/note';
const ADD_NOTE = createRequestAction(`${KEY}/add`);
const EDIT_NOTE = createRequestAction(`${KEY}/edit`);
const DELETE_NOTE = createRequestAction(`${KEY}/delete`);

function fetchNotes(type) {
  return filters => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `note/notes?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

function fetchNotesByType(type) {
  return (targetType, targetUUIDs) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `note/notes/info/${targetType}?${buildQueryString({ targetUUIDs })}`,
        method: 'GET',
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
        bailout: !logged || !targetUUIDs.length,
      },
    });
  };
}

function addNote(type) {
  return ({ content, pinned, playerUUID, targetType, targetUUID }) => (dispatch, getState) => {
    const {
      auth: { token, logged, fullName },
    } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'note/notes',
        method: 'POST',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          pinned,
          playerUUID,
          targetType,
          targetUUID,
          author: fullName,
        }),
        bailout: !logged,
      },
    });
  };
}

function editNote(type) {
  return (id, { content, pinned, playerUUID, targetType, targetUUID }) => (dispatch, getState) => {
    const { auth: { token, logged, fullName } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `note/notes/${id}`,
        method: 'PUT',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          pinned,
          playerUUID,
          targetType,
          targetUUID,
          author: fullName,
        }),
        bailout: !logged,
      },
    });
  };
}

function deleteNote(type) {
  return id => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `note/notes/${id}`,
        method: 'DELETE',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
  fetchNotes,
  fetchNotesByType,
  addNote,
  editNote,
  deleteNote,
};

export {
  actionTypes,
  actionCreators,
  sourceActionCreators,
};
