import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import getFingerprint from '../../../utils/fingerPrint';
import { brandsConfig, departmentsConfig } from '../constants';

function mapBrands(brands) {
  return brands
    .map(brand => ({ id: brand, ...brandsConfig[brand.split('_')[0]] }))
    .filter(brand => !!brand);
}

const KEY = 'sign-in';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const SELECT_BRAND = `${KEY}/select-brand`;
const SELECT_DEPARTMENT = `${KEY}/select-department`;

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
      }),
      types: [
        SIGN_IN.REQUEST,
        SIGN_IN.SUCCESS,
        SIGN_IN.FAILURE,
      ],
    },
  });
}

function selectBrand(brand) {
  return {
    type: SELECT_BRAND,
    payload: brand,
  };
}

function selectDepartment(department) {
  return {
    type: SELECT_BRAND,
    payload: department,
  };
}

const initialState = {
  brand: null,
  brands: [],
  department: null,
  departments: [],
  data: {
    token: null,
    login: null,
    uuid: null,
    permissions: null,
    departmentsByBrand: null,
  },
};
const actionHandlers = {
  [SIGN_IN.SUCCESS]: (state, action) => ({
    ...state,
    brands: mapBrands(Object.keys(action.payload.departmentsByBrand)),
    data: { ...state.data, ...action.payload },
  }),
  [SELECT_BRAND]: (state, action) => ({
    ...state,
    brand: action.payload,
    departments: action.payload && action.payload.id
      ? state.data.departmentsByBrand[action.payload.id].map(department => departmentsConfig[department])
      : [],
  }),
  [SELECT_DEPARTMENT]: (state, action) => ({
    ...state,
    department: action.payload,
  }),
};
const actionTypes = {
  SIGN_IN,
  SELECT_BRAND,
  SELECT_DEPARTMENT,
};
const actionCreators = {
  signIn,
  selectBrand,
  selectDepartment,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
