import { CALL_API } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import createReducer from '../../utils/createReducer';
import createRequestAction from '../../utils/createRequestAction';
import { sourceActionCreators as operatorSourceActionCreators } from './operator';
import getFingerprint from '../../utils/fingerPrint';
import timestamp from '../../utils/timestamp';
import { getBrand } from '../../config';

const KEY = 'auth';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update-profile`);
const FETCH_AUTHORITIES = createRequestAction(`${KEY}/fetch-authorities`);
const CHANGE_AUTHORITY = createRequestAction(`${KEY}/change-authorities`);
const REFRESH_TOKEN = createRequestAction(`${KEY}/refresh-token`);
const LOGOUT = createRequestAction(`${KEY}/logout`);
const SET_LAST_ACTIVITY = `${KEY}/set-last-activity`;
const CHANGE_EMAIL_NOTIFICATION_SETTING = `${KEY}/change-email-notification-setting`;

const fetchProfile = operatorSourceActionCreators.fetchProfile(FETCH_PROFILE);
const fetchAuthorities = operatorSourceActionCreators.fetchAuthorities(FETCH_AUTHORITIES);
const updateProfile = operatorSourceActionCreators.updateProfile(UPDATE_PROFILE);

function signIn(data) {
  return async dispatch => dispatch({
    [CALL_API]: {
      endpoint: '/auth/signin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        device: await getFingerprint(),
        brandId: getBrand(),
      }),
      types: [
        {
          type: SIGN_IN.REQUEST,
          meta: { department: data.department },
        },
        SIGN_IN.SUCCESS,
        SIGN_IN.FAILURE,
      ],
    },
  });
}

function refreshToken(outsideToken = null) {
  return (dispatch, getState) => {
    const { auth: { token, logged, refreshingToken } } = getState();

    return dispatch({
      [CALL_API]: {
        method: 'GET',
        endpoint: `/auth/token/renew?token=${outsideToken || token}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${outsideToken || token}`,
        },
        types: [REFRESH_TOKEN.REQUEST, REFRESH_TOKEN.SUCCESS, REFRESH_TOKEN.FAILURE],
        bailout: (!outsideToken && !token) || !logged || refreshingToken,
      },
    });
  };
}

function changeDepartment(department, brandId = getBrand(), token = null) {
  return async (dispatch, getState) => {
    const { auth: { token: currentToken, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        method: 'POST',
        endpoint: `/auth/signin/${brandId}/${department}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || currentToken}`,
        },
        body: JSON.stringify({
          device: await getFingerprint(),
        }),
        types: [CHANGE_AUTHORITY.REQUEST, CHANGE_AUTHORITY.SUCCESS, CHANGE_AUTHORITY.FAILURE],
        bailout: !logged && !token,
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

function successSignInReducer(state, action) {
  const { login, uuid, token } = action.payload;
  const tokenData = jwtDecode(token);

  return {
    ...state,
    token,
    uuid,
    login,
    logged: true,
    department: tokenData.department,
  };
}

function setLastActivity(time) {
  return {
    type: SET_LAST_ACTIVITY,
    payload: { timestamp: time },
  };
}

function changeEmailNotificationSetting(payload) {
  return {
    type: CHANGE_EMAIL_NOTIFICATION_SETTING,
    payload,
  };
}

const initialState = {
  lastActivity: null,
  refreshingToken: false,
  authorities: [],
  department: null,
  logged: false,
  token: null,
  uuid: null,
  login: null,
  fullName: null,
  notifications: {
    email: true,
  },
  data: {},
};
const actionHandlers = {
  [FETCH_AUTHORITIES.SUCCESS]: (state, action) => ({
    ...state,
    authorities: action.payload,
  }),
  [SIGN_IN.SUCCESS]: successSignInReducer,
  [CHANGE_AUTHORITY.SUCCESS]: successSignInReducer,
  [FETCH_PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    fullName: [action.payload.firstName, action.payload.lastName].join(' ').trim(),
    data: action.payload,
  }),
  [UPDATE_PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
  [REFRESH_TOKEN.REQUEST]: state => ({
    ...state,
    refreshingToken: true,
  }),
  [REFRESH_TOKEN.SUCCESS]: (state, action) => (
    action.payload.jwtToken === null
      ? { ...initialState }
      : {
        ...state,
        token: action.payload.jwtToken,
        refreshingToken: false,
      }
  ),
  [REFRESH_TOKEN.FAILURE]: state => ({
    ...state,
    refreshingToken: false,
  }),
  [LOGOUT.SUCCESS]: () => ({ ...initialState }),
  [SET_LAST_ACTIVITY]: (state, action) => ({
    ...state,
    lastActivity: action.payload.timestamp,
  }),
  [CHANGE_EMAIL_NOTIFICATION_SETTING]: (state, action) => ({
    ...state,
    notifications: { ...state.notifications, email: action.payload },
  }),
};
const actionTypes = {
  SIGN_IN,
  CHANGE_AUTHORITY,
  FETCH_PROFILE,
  REFRESH_TOKEN,
  LOGOUT,
  UPDATE_PROFILE,
  SET_LAST_ACTIVITY,
  CHANGE_EMAIL_NOTIFICATION_SETTING,
};
const actionCreators = {
  signIn,
  fetchProfile,
  fetchAuthorities,
  changeDepartment,
  logout,
  refreshToken,
  setLastActivity,
  resetPasswordConfirm,
  updateProfile,
  changeEmailNotificationSetting,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default createReducer(initialState, actionHandlers);
