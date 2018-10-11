import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import { types, statuses } from '../../../../../../../constants/limits';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../redux/modules/note';

const KEY = 'user-limits';
const SET_LIMITS_LIST = `${KEY}/set-limits-list`;
const FETCH_LIMITS = createRequestAction(`${KEY}/fetch-limits-by-type`);
const FETCH_DEPOSIT_LIMIT = createRequestAction(`${KEY}/fetch-deposit-limits`);
const SET_LIMIT = createRequestAction(`${KEY}/set-limit`);
const CANCEL_LIMIT = createRequestAction(`${KEY}/cancel-limit`);
const CANCEL_DEPOSIT_LIMIT = createRequestAction(`${KEY}/cancel-deposit-limit`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotesFn = noteSourceActionCreators.fetchNotesByTargetUuids(FETCH_NOTES);
const mapNotesToLimits = (limits, notes) => {
  if (!notes || notes.length === 0) {
    return limits;
  }

  return limits.map(limit => ({
    ...limit,
    note: notes.find(n => n.targetUUID === limit.uuid) || null,
  }));
};

function fetchLimitsByType(uuid, type) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing_session/${uuid}/limit-history/${type}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_LIMITS.REQUEST,
          {
            type: FETCH_LIMITS.SUCCESS,
            meta: { type },
          },
          FETCH_LIMITS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchDepositLimit(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/limits/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_DEPOSIT_LIMIT.REQUEST,
          {
            type: FETCH_DEPOSIT_LIMIT.SUCCESS,
            meta: { type: types.DEPOSIT },
          },
          FETCH_DEPOSIT_LIMIT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function setLimitsList(payload) {
  return {
    type: SET_LIMITS_LIST,
    payload,
  };
}

function sortByDate(a, b) {
  if (a.creationDate > b.creationDate) {
    return -1;
  } else if (a.creationDate < b.creationDate) {
    return 1;
  }

  return 0;
}

function sortByStatus(a, b) {
  if (a.status === statuses.IN_PROGRESS && b.status === statuses.IN_PROGRESS) {
    return sortByDate(a, b);
  } else if (a.status === statuses.IN_PROGRESS) {
    return 1;
  } else if (b.status === statuses.IN_PROGRESS) {
    return -1;
  }

  return sortByDate(a, b);
}

function mapLimitType(type) {
  return item => ({ ...item, type });
}

function mapLimitFetchActions(action) {
  return action.error ? [] : action.payload.map(mapLimitType(action.meta.type));
}

function mapLimitsActions(actions) {
  return actions
    .map(mapLimitFetchActions)
    .reduce((res, curr) => [...res, ...curr], [])
    .sort(sortByStatus);
}

function fetchLimits(uuid, fetchNotes = fetchNotesFn) {
  return dispatch => Promise.all([
    dispatch(fetchLimitsByType(uuid, types.SESSION_DURATION)),
    dispatch(fetchLimitsByType(uuid, types.LOSS)),
    dispatch(fetchLimitsByType(uuid, types.WAGER)),
    dispatch(fetchDepositLimit(uuid)),
  ]).then(actions => dispatch(setLimitsList(mapLimitsActions(actions))))
    .then((action) => {
      if (action.payload.length) {
        dispatch(fetchNotes(action.payload.map(item => item.uuid)));
      }
    });
}

function setPlayingSessionLimit(playerUUID, type, data) {
  return (dispatch, getState) => {
    const {
      auth: { token, logged, brandId },
    } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing_session/${playerUUID}/limits/${type}?brandId=${brandId}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [SET_LIMIT.REQUEST, SET_LIMIT.SUCCESS, SET_LIMIT.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function setDepositLimit(playerUUID, data) {
  return (dispatch, getState) => {
    const {
      auth: { token, logged },
    } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/limits/${playerUUID}/deposit`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [SET_LIMIT.REQUEST, SET_LIMIT.SUCCESS, SET_LIMIT.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function setLimit(playerUUID, type, data) {
  return (dispatch) => {
    if ([types.WAGER, types.LOSS, types.SESSION_DURATION].indexOf(type) > -1) {
      return dispatch(setPlayingSessionLimit(playerUUID, type, data));
    } else if (type === types.DEPOSIT) {
      return dispatch(setDepositLimit(playerUUID, data));
    }

    throw new Error(`Unknown limit type "${type}" inside setLimit`);
  };
}

function cancelPlayingSessionLimit(playerUUID, type, limitId) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing_session/${playerUUID}/limits/${type}/${limitId}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CANCEL_LIMIT.REQUEST,
          CANCEL_LIMIT.SUCCESS,
          CANCEL_LIMIT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function cancelDepositLimit(playerUUID, limitId) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/limits/${playerUUID}/deposit/${limitId}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CANCEL_DEPOSIT_LIMIT.REQUEST,
          CANCEL_DEPOSIT_LIMIT.SUCCESS,
          CANCEL_DEPOSIT_LIMIT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function cancelLimit(playerUUID, type, limitId) {
  return (dispatch) => {
    if ([types.WAGER, types.LOSS, types.SESSION_DURATION].indexOf(type) > -1) {
      return dispatch(cancelPlayingSessionLimit(playerUUID, type, limitId));
    } else if (type === types.DEPOSIT) {
      return dispatch(cancelDepositLimit(playerUUID, limitId));
    }

    throw new Error(`Unknown limit type "${type}" inside cancelLimit`);
  };
}

const initialState = {
  list: [],
};
const actionHandlers = {
  [SET_LIMITS_LIST]: (state, action) => ({
    ...state,
    list: [...action.payload],
  }),
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    list: mapNotesToLimits(state.list, action.payload.content),
  }),
};
const actionTypes = {
  FETCH_LIMITS,
  SET_LIMIT,
  SET_LIMITS_LIST,
  CANCEL_LIMIT,
};
const actionCreators = {
  fetchLimits,
  setLimit,
  cancelLimit,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
