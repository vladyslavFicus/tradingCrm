import jwtDecode from 'jwt-decode';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';

const KEY = 'auth';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update-profile`);
const FETCH_AUTHORITIES = createRequestAction(`${KEY}/fetch-authorities`);
const CHANGE_AUTHORITY = createRequestAction(`${KEY}/change-authorities`);
const REFRESH_TOKEN = createRequestAction(`${KEY}/refresh-token`);
const LOGOUT = createRequestAction(`${KEY}/logout`);
const SET_DEPARTMENTS_BY_BRAND = `${KEY}/set-departments-by-brand`;

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
const actionCreators = {};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default createReducer(initialState, actionHandlers);
