import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../utils/createReducer';
import createRequestAction from '../../utils/createRequestAction';
import { sourceActionCreators as operatorSourceActionCreators } from './operator';

const KEY = 'auth';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const REFRESH_TOKEN = createRequestAction(`${KEY}/refresh-token`);
const VALIDATE_TOKEN = createRequestAction(`${KEY}/validate-token`);
const LOGOUT = createRequestAction(`${KEY}/logout`);

const fetchProfile = operatorSourceActionCreators.fetchProfile(FETCH_PROFILE);

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
        endpoint: '/auth/logout',
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

function resetPasswordConfirm(type) {
  return ({ password, repeatPassword, token }) => dispatch => dispatch({
    [CALL_API]: {
      endpoint: '/auth/password/reset',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, repeatPassword, token }),
      types: [
        type.REQUEST,
        type.SUCCESS,
        type.FAILURE,
      ],
    },
  });
}

const initialState = {
  department: null,
  logged: false,
  token: null,
  uuid: null,
  username: null,
  fullName: null,
  data: {},
};
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
  [SIGN_IN.FAILURE]: state => ({
    ...state,
    department: null,
  }),
  [FETCH_PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    fullName: [action.payload.firstName, action.payload.lastName].join(' ').trim(),
    data: action.payload,
  }),

  [REFRESH_TOKEN.SUCCESS]: (state, action) => ({
    ...state,
    token: action.payload.jwtToken,
  }),
  [LOGOUT.SUCCESS]: () => ({ ...initialState }),
  [VALIDATE_TOKEN.SUCCESS]: (state, action) => (
    !action.payload.valid
      ? { ...initialState }
      : state
  ),
};
const actionTypes = {
  SIGN_IN,
  FETCH_PROFILE,
  REFRESH_TOKEN,
  VALIDATE_TOKEN,
  LOGOUT,
};
const actionCreators = {
  signIn,
  fetchProfile,
  logout,
  refreshToken,
  validateToken,
  resetPasswordConfirm,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default createReducer(initialState, actionHandlers);
