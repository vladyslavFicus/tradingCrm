import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import { actionTypes as authActionTypes } from 'redux/modules/auth';

const KEY = 'permissions';
const FETCH_PERMISSIONS = createRequestAction(`${KEY}/fetch-permissions`);
const SET_PERMISSIONS = `${KEY}/set-permissions`;

function fetchPermissions() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        method: 'GET',
        endpoint: `auth/permissions`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [FETCH_PERMISSIONS.REQUEST, FETCH_PERMISSIONS.SUCCESS, FETCH_PERMISSIONS.FAILURE],
        bailout: !logged,
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

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_PERMISSIONS.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_PERMISSIONS.SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload.map(item => `${item.serviceName};${item.httpMethod};${item.urlPattern}`),
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
  [authActionTypes.SIGN_IN.SUCCESS]: (state, action) => ({
    ...state,
    data: (
      action.payload.permissions ?
        typeof action.payload.permissions === 'string'
          ? JSON.parse(action.payload.permissions)
          : action.payload.permissions
        : []
    ).map(item => `${item.serviceName};${item.httpMethod};${item.urlPattern}`),
  }),
  [authActionTypes.LOGOUT.SUCCESS]: (state, action) => ({
    ...initialState,
  }),
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
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

export default reducer;
