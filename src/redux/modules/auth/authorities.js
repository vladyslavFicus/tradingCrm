import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';

const mapAuthoritiesOptions = (payload) => {
  if (payload.post && payload.post.departmentRole) {
    const nextPayload = { ...payload };

    delete nextPayload.post.departmentRole.PLAYER;

    return nextPayload;
  }

  return payload;
};

const KEY = 'authorities';
const ADD_AUTHORITY = createRequestAction(`${KEY}/add-authority`);
const DELETE_AUTHORITY = createRequestAction(`${KEY}/delete-authority`);
const FETCH_AUTHORITIES_OPTIONS = createRequestAction(`${KEY}/fetch-options`);

function addAuthority(uuid, department, role) {
  return (dispatch, getState) => {
    const { auth: { logged, brandId } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/authorities`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandId, department, role }),
        types: [
          ADD_AUTHORITY.REQUEST,
          ADD_AUTHORITY.SUCCESS,
          ADD_AUTHORITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function deleteAuthority(uuid, department, role) {
  return (dispatch, getState) => {
    const { auth: { logged, brandId } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/authorities`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandId, department, role }),
        types: [
          DELETE_AUTHORITY.REQUEST,
          DELETE_AUTHORITY.SUCCESS,
          DELETE_AUTHORITY.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchAuthorities(uuid) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/authorities`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          FETCH_AUTHORITIES_OPTIONS.REQUEST,
          FETCH_AUTHORITIES_OPTIONS.SUCCESS,
          FETCH_AUTHORITIES_OPTIONS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchAuthoritiesOptions() {
  return (dispatch, getState) => {
    const { auth: { logged, uuid } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/authorities`,
        method: 'OPTIONS',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          FETCH_AUTHORITIES_OPTIONS.REQUEST,
          FETCH_AUTHORITIES_OPTIONS.SUCCESS,
          FETCH_AUTHORITIES_OPTIONS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: {},
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_AUTHORITIES_OPTIONS.REQUEST]: state => ({ ...state, isLoading: true }),
  [FETCH_AUTHORITIES_OPTIONS.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    data: mapAuthoritiesOptions(action.payload),
  }),
  [FETCH_AUTHORITIES_OPTIONS.FAILURE]: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
};
const actionTypes = {
  ADD_AUTHORITY,
  DELETE_AUTHORITY,
  FETCH_AUTHORITIES_OPTIONS,
};
const actionCreators = {
  addAuthority,
  deleteAuthority,
  fetchAuthorities,
  fetchAuthoritiesOptions,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
