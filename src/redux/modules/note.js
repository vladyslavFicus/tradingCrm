import { CALL_API } from 'redux-api-middleware';
import buildQueryString from 'utils/buildQueryString';

function fetchNotes(type) {
  return (filters) => (dispatch, getState) => {
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

function addNote(type) {
  return ({ content, pinned, playerUUID, targetType, targetUUID }) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `note/notes`,
        method: 'POST',
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, pinned, playerUUID, targetType, targetUUID }),
        bailout: !logged,
      },
    });
  };
}

function editNote(type) {
  return (id, { content, pinned, playerUUID, targetType, targetUUID }) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

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
        body: JSON.stringify({ content, pinned, playerUUID, targetType, targetUUID }),
        bailout: !logged,
      },
    });
  };
}

function deleteNote(type) {
  return (id) => (dispatch, getState) => {
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

const initialState = {};
const actionHandlers = {};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {};
const actionCreators = {
  fetchNotes,
  addNote,
  editNote,
  deleteNote,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
