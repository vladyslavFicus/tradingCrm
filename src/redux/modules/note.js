import { CALL_API } from 'redux-api-middleware';
import { v4 } from 'uuid';
import buildQueryString from '../../utils/buildQueryString';
import createRequestAction from '../../utils/createRequestAction';
import { tagTypes } from './../../constants/tag';

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

function fetchNotesByTargetUuids(type) {
  return targetUUIDs => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'tag/tags/targets',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUuids: targetUUIDs,
        }),
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
  return ({ content, pinned, targetUUID }) => (dispatch, getState) => {
    const {
      auth: { token, logged },
    } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'tag/',
        method: 'POST',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tagId: `NOTE-${v4()}`,
          tagType: tagTypes.NOTE,
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
  return (id, { tagId, targetUUID, content: newContent, pinned }) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'tag/',
        method: 'PUT',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tagId,
          targetUUID,
          newContent,
          pinned,
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
        endpoint: `tag/${id}`,
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
