import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import Storage from 'utils/storage';

const KEY = 'auth';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const REFRESH_TOKEN = createRequestAction(`${KEY}/refresh-token`);
const LOGOUT = createRequestAction(`${KEY}/logout`);

const actionHandlers = {
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

  [REFRESH_TOKEN.SUCCESS]: (state, action) => ({
    ...state,
    token: action.payload.jwtToken,
  }),
  [LOGOUT.SUCCESS]: (state, action) => ({ ...initialState, }),
};

function signIn({ login, password }) {
  return {
    [CALL_API]: {
      endpoint: '/auth/signin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password,
      }),
      types: [SIGN_IN.REQUEST, SIGN_IN.SUCCESS, SIGN_IN.FAILURE],
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
  logged: false,
  token: null,
  uuid: null,
  username: null,
};

function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  SIGN_IN,
  REFRESH_TOKEN,
  LOGOUT,
};

const actionCreators = {
  signIn,
  logout,
  refreshToken,
};

export { actionCreators, actionTypes };

export default reducer;
