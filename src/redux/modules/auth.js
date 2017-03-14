import createReducer from 'utils/createReducer';
import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';

const KEY = 'auth';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const REFRESH_TOKEN = createRequestAction(`${KEY}/refresh-token`);
const VALIDATE_TOKEN = createRequestAction(`${KEY}/validate-token`);
const LOGOUT = createRequestAction(`${KEY}/logout`);

const actionHandlers = {
  [SIGN_IN.REQUEST]: (state, action) => ({
    ...state,
    department: action.meta && action.meta.department
      ? action.meta.department
      : state.department,
  }),
  [SIGN_IN.SUCCESS]: (state, action) => {
    const { login: username, uuid, token } = action.payload;

    return {
      ...state,
      token,
      uuid,
      username,
      logged: true,
    };
  },
  [SIGN_IN.FAILURE]: (state, action) => ({
    ...state,
    department: null,
  }),

  [REFRESH_TOKEN.SUCCESS]: (state, action) => ({
    ...state,
    token: action.payload.jwtToken,
  }),
  [LOGOUT.SUCCESS]: (state, action) => ({ ...initialState, }),
  [VALIDATE_TOKEN.SUCCESS]: (state, action) => (
    !action.payload.valid
      ? { ...initialState, }
      : state
  ),
};

function signIn(data) {
  return {
    [CALL_API]: {
      endpoint: '/auth/signin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      types: [
        {
          type: SIGN_IN.REQUEST,
          meta: { department: data.department },
        },
        SIGN_IN.SUCCESS,
        SIGN_IN.FAILURE,
      ],
    },
  };
}

function refreshToken() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        method: 'GET',
        endpoint: `/auth/token/renew?token=${token}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [REFRESH_TOKEN.REQUEST, REFRESH_TOKEN.SUCCESS, REFRESH_TOKEN.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function validateToken() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        method: 'GET',
        endpoint: `/auth/token/validate?token=${token}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [VALIDATE_TOKEN.REQUEST, VALIDATE_TOKEN.SUCCESS, VALIDATE_TOKEN.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function logout() {
  return (dispatch, getState) => {
    const { auth: { token } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/auth/logout`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [LOGOUT.REQUEST, LOGOUT.SUCCESS, LOGOUT.FAILURE],
      },
    });
  };
}

const initialState = {
  department: null,
  logged: false,
  token: null,
  uuid: null,
  username: null,
};
const actionTypes = {
  SIGN_IN,
  REFRESH_TOKEN,
  VALIDATE_TOKEN,
  LOGOUT,
};
const actionCreators = {
  signIn,
  logout,
  refreshToken,
  validateToken,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default createReducer(initialState, actionHandlers);
