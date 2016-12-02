import { WEB_API } from 'constants/index';
import { replace } from 'react-router-redux';
import Storage from 'utils/storage';

const KEY = 'auth';

const LOGIN_REQUEST = `${KEY}/login-request`;
const LOGIN_SUCCESS = `${KEY}/login-success`;
const LOGIN_FAILURE = `${KEY}/login-failure`;

const REFRESH_TOKEN_REQUEST = `${KEY}/refresh-token-request`;
const REFRESH_TOKEN_SUCCESS = `${KEY}/refresh-token-success`;
const REFRESH_TOKEN_FAILURE = `${KEY}/refresh-token-failure`;

const LOGOUT_REQUEST = `${KEY}/logout-request`;
const LOGOUT_SUCCESS = `${KEY}/logout-success`;
const LOGOUT_FAILURE = `${KEY}/logout-failure`;

const LOGOUT = `${KEY}/logout`;

const handlers = {
  [LOGIN_SUCCESS]: (state, action) => {
    const { login: username, uuid, token } = action.response;

    return {
      ...state,
      token,
      uuid,
      username,
    };
  },

  [REFRESH_TOKEN_SUCCESS]: (state, action) => {
    return {
      ...state,
      token: action.response.jwtToken,
    };
  },

  [LOGOUT_SUCCESS]: (state, action) => ({
    ...initialState,
  }),
};

function logoutAndRedirect() {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    dispatch(logout());

    return replace({
      pathname: '/sign-in',
      state: { nextPathname: getState().router.locationBeforeTransitions.pathname },
    });
  };
}

function refreshToken() {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE],
        endpoint: `auth/token/renew?token=${token}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function logout() {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
        endpoint: `auth/logout`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

let storageValue = Storage.get(KEY, true);
if (storageValue && storageValue.token) {
  storageValue = { ...storageValue };
}

export const initialState = {
  token: null,
  uuid: null,
  username: null,
};

function reducer(state = { ...initialState, ...storageValue }, action) {
  const handler = handlers[action.type];

  if (handler) {
    const newState = handler(state, action);
    if (newState.token !== state.token) {
      Storage.set(KEY, newState);
    }

    return newState;
  } else {
    return state;
  }
}

const actionTypes = {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT,
};

const actionCreators = {
  logout,
  logoutAndRedirect,
  refreshToken,
};

export { actionCreators, actionTypes };

export default reducer;
