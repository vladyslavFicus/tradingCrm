import { CALL_API } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import { sourceActionCreators as operatorSourceActionCreators } from '../operator';
import { actionCreators as optionsActionCreators } from '../profile/options';

const KEY = 'auth';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update-profile`);
const FETCH_AUTHORITIES = createRequestAction(`${KEY}/fetch-authorities`);
const CHANGE_AUTHORITY = createRequestAction(`${KEY}/change-authorities`);
const REFRESH_TOKEN = createRequestAction(`${KEY}/refresh-token`);
const LOGOUT = createRequestAction(`${KEY}/logout`);
const SET_DEPARTMENTS_BY_BRAND = `${KEY}/set-departments-by-brand`;

const fetchProfile = operatorSourceActionCreators.fetchProfile(FETCH_PROFILE);
const fetchAuthorities = operatorSourceActionCreators.fetchAuthorities(FETCH_AUTHORITIES);
const updateProfile = operatorSourceActionCreators.updateProfile(UPDATE_PROFILE);

function signIn(data) {
  return async dispatch => dispatch({
    [CALL_API]: {
      endpoint: '/auth/signin/operator',
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
  });
}

function changeDepartment(department, brandId, token = null) {
  return async (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        method: 'POST',
        endpoint: `/auth/signin/operator/${brandId}/${department}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [CHANGE_AUTHORITY.REQUEST, CHANGE_AUTHORITY.SUCCESS, CHANGE_AUTHORITY.FAILURE],
        bailout: !logged && !token,
      },
    });
  };
}

function logout() {
  return dispatch => dispatch({
    [CALL_API]: {
      endpoint: '/auth/logout',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [LOGOUT.REQUEST, LOGOUT.SUCCESS, LOGOUT.FAILURE],
    },
  }).then(() => dispatch(optionsActionCreators.reset()));
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

function passwordResetRequest(type) {
  return (uuid, sendEmail = true) => (dispatch, getState) => {
    const { auth: { logged, brandId } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/password/${brandId}/${uuid}/reset/request${sendEmail ? '' : '?send-mail=false'}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function passwordResetConfirm(type) {
  return (password, repeatPassword, token) => ({
    [CALL_API]: {
      endpoint: 'auth/password/reset',
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
    brandId: tokenData.brandId,
    department: tokenData.department,
    role: tokenData.role,
  };
}

function setDepartmentsByBrand(payload) {
  return {
    type: SET_DEPARTMENTS_BY_BRAND,
    payload,
  };
}

const initialState = {
  brandId: null,
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
  departmentsByBrand: {},
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
  [REFRESH_TOKEN.SUCCESS]: (state, action) => {
    if (action.payload.jwtToken === null) {
      return { ...initialState };
    }

    const tokenData = jwtDecode(action.payload.jwtToken);

    return {
      ...state,
      brandId: tokenData.brandId,
      token: action.payload.jwtToken,
      refreshingToken: false,
    };
  },
  [REFRESH_TOKEN.FAILURE]: state => ({
    ...state,
    refreshingToken: false,
  }),
  [LOGOUT.SUCCESS]: () => ({ ...initialState }),
  [SET_DEPARTMENTS_BY_BRAND]: (state, { payload }) => ({
    ...state,
    departmentsByBrand: payload,
  }),
};
const actionTypes = {
  SIGN_IN,
  CHANGE_AUTHORITY,
  FETCH_PROFILE,
  REFRESH_TOKEN,
  LOGOUT,
  UPDATE_PROFILE,
  SET_DEPARTMENTS_BY_BRAND,
};
const actionCreators = {
  signIn,
  fetchProfile,
  fetchAuthorities,
  changeDepartment,
  logout,
  resetPasswordConfirm,
  updateProfile,
  setDepartmentsByBrand,
  passwordResetRequest,
  passwordResetConfirm,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default createReducer(initialState, actionHandlers);
