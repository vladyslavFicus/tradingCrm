import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import getFingerprint from '../../../utils/fingerPrint';
import { brandsConfig, departmentsConfig } from '../constants';

function mapBrands(brands) {
  return brands
    .map((brand, index) => ({ id: `${brand}_${index}`, brand, ...brandsConfig[brand.split('_')[0]] }))
    .filter(brand => !!brand);
}

const KEY = 'sign-in';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const SELECT_BRAND = `${KEY}/select-brand`;

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
  [SIGN_IN.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      brands: mapBrands(new Array(3).fill(Object.keys(action.payload.departmentsByBrand)[0])),
      // brands: mapBrands(Object.keys(action.payload.departmentsByBrand)),
      data: { ...state.data, ...action.payload },
    };

    if (newState.brands.length === 1) {
      newState.brand = newState.brands[0];
      newState.departments = action.payload && action.payload.departmentsByBrand
        ? action.payload.departmentsByBrand[newState.brand.brand].map(department => ({
          id: department,
          role: 'ROLE4',
          ...departmentsConfig[department],
        }))
        : [];
    }

    return newState;
  },
  [SELECT_BRAND]: (state, action) => ({
    ...state,
    brand: action.payload,
    departments: action.payload && action.payload.id
      ? state.data.departmentsByBrand[action.payload.brand].map(department => ({
        id: department,
        role: 'ROLE4',
        ...departmentsConfig[department],
      }))
      : [],
  }),
};
const actionTypes = {
  SIGN_IN,
  SELECT_BRAND,
};
const actionCreators = {
  signIn,
  selectBrand,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
