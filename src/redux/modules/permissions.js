import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../utils/createReducer';
import createRequestAction from '../../utils/createRequestAction';
import { actionTypes as authActionTypes } from './auth';
import timestamp from '../../utils/timestamp';

const KEY = 'permissions';
const FETCH_PERMISSIONS = createRequestAction(`${KEY}/fetch-permissions`);
const SET_PERMISSIONS = `${KEY}/set-permissions`;

function fetchPermissions(outsideToken = null) {
  return (dispatch, getState) => {
    const { auth: { token, logged }, permissions: { receivedAt, isLoading } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'auth/permissions',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${outsideToken || token}`,
        },
        types: [
          FETCH_PERMISSIONS.REQUEST,
          FETCH_PERMISSIONS.SUCCESS,
          FETCH_PERMISSIONS.FAILURE,
        ],
        bailout: !logged && !outsideToken && (timestamp() - receivedAt < 3000) && !isLoading,
      },
    });
  };
}

function setPermissions(permissions) {
  return {
    type: SET_PERMISSIONS,
    payload: permissions,
  };
}

function successSignInReducer(state, action) {
  const permissions = action.payload.permissions || [];

  return {
    ...state,
    data: (
      typeof permissions === 'string'
        ? JSON.parse(permissions)
        : permissions
    ).map(item => `${item.serviceName};${item.httpMethod};${item.urlPattern}`),
  };
}

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_PERMISSIONS.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_PERMISSIONS.SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload.map(item => `${item.serviceName};${item.httpMethod};${item.urlPattern}`),
    receivedAt: timestamp(),
    isLoading: false,
  }),
  [FETCH_PERMISSIONS.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
  }),
  [SET_PERMISSIONS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
  [authActionTypes.SIGN_IN.SUCCESS]: successSignInReducer,
  [authActionTypes.CHANGE_AUTHORITY.SUCCESS]: successSignInReducer,
  [authActionTypes.LOGOUT.SUCCESS]: () => ({ ...initialState }),
};

const actionTypes = {
  FETCH_PERMISSIONS,
};
const actionCreators = {
  setPermissions,
  fetchPermissions,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
