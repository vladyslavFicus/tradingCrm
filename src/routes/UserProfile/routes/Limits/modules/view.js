import createReducer from 'utils/createReducer';
import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import { LIMIT_TYPES, LIMIT_STATUSES } from '../constants';

const KEY = 'user-limits';
const SET_LIMITS_LIST = `${KEY}/set-limits-list`;
const FETCH_LIMITS = createRequestAction(`${KEY}/fetch-limits-by-type`);
const SET_LIMIT = createRequestAction(`${KEY}/set-limit`);
const CANCEL_LIMIT = createRequestAction(`${KEY}/cancel-limit`);

function fetchLimitsByType(uuid, type) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing-session/${uuid}/limits/${type}`,
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
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then((json) => json);
              }
            },
            meta: { type },
          },
          FETCH_LIMITS.FAILURE,
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
  if (a.status === LIMIT_STATUSES.ACTIVE && b.status === LIMIT_STATUSES.ACTIVE) {
    return sortByDate(a, b);
  } else if (a.status === LIMIT_STATUSES.ACTIVE) {
    return 1;
  } else if (b.status === LIMIT_STATUSES.ACTIVE) {
    return -1;
  }

  return sortByDate(a, b);
}

function mapLimitsActions(actions) {
  return actions
    .map(mapLimitFetchActions)
    .reduce((res, curr) => [...res, ...curr], [])
    .sort(sortByStatus);
}

function mapLimitFetchActions(action) {
  return action.error ? [] : action.payload.content.map(mapLimitType(action.meta.type));
}

function mapLimitType(type) {
  return (item, key) => ({ ...item, type });
}

function fetchLimits(uuid) {
  return (dispatch, getState) => Promise.all([
    dispatch(fetchLimitsByType(uuid, LIMIT_TYPES.SESSION_DURATION)),
    dispatch(fetchLimitsByType(uuid, LIMIT_TYPES.LOSS)),
    dispatch(fetchLimitsByType(uuid, LIMIT_TYPES.WAGER)),
  ]).then((actions) => dispatch(setLimitsList(mapLimitsActions(actions))));
}

function setLimit(type, data) {
  return (dispatch, getState) => {
    const { auth: { token, uuid, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing-session/${uuid}/limits/${type}`,
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

function cancelLimit(uuid, type, id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/playing-session/${uuid}/limits/${type}/${id}`,
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

const initialState = {
  list: [],
};
const actionHandlers = {
  [SET_LIMITS_LIST]: (state, action) => ({
    ...state,
    list: [...action.payload],
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
