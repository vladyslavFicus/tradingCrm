import { replace } from 'react-router-redux';
import Storage from 'utils/storage';
import jwtDecode from 'jwt-decode';

const KEY = 'auth';

const LOGIN_REQUEST = `${KEY}/login-request`;
const LOGIN_SUCCESS = `${KEY}/login-success`;
const LOGIN_FAILURE = `${KEY}/login-failure`;

const LOGOUT = `${KEY}/logout`;

const handlers = {
  [LOGIN_SUCCESS]: (state, action) => {
    const { username, uuid } = extractJwtData(action.response.token);

    return {
      ...state,
      token: action.response.token,
      uuid,
      username,
    };
  },

  [LOGOUT]: (state, action) => ({
    ...initialState,
    token: null,
    uuid: null,
  }),
};

function extractJwtData(token) {
  const extractedData = { username: null, uuid: null };
  try {
    const data = jwtDecode(token);

    extractedData.username = data.user_name || null;
    extractedData.uuid = data.user_uuid || null;

    return extractedData;
  } catch (e) {
    return extractedData;
  }
}

function logout() {
  return {
    type: LOGOUT,
  };
}

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

let storageValue = Storage.get(KEY, true);
if (storageValue && storageValue.token) {
  storageValue = { ...storageValue, ...extractJwtData(storageValue.token) };
}

const initialState = {
  token: null,
  uuid: null,
  username: null,
  ...storageValue,
};

function reducer(state = initialState, action) {
  const handler = handlers[action.type];

  if (handler) {
    const newState = handler(state, action);
    if (newState.token !== state.token || newState.uuid !== state.uuid) {
      Storage.set(KEY, { token: newState.token, uuid: newState.uuid });
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
  LOGOUT,
};

const actionCreators = {
  logout,
  logoutAndRedirect,
};

export { actionCreators, actionTypes };

export default reducer;
