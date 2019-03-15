import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import getFingerprint from '../../../utils/fingerPrint';
import { mapBrands, mapDepartments } from '../../../utils/brands';

const KEY = 'sign-in';
const SIGN_IN = createRequestAction(`${KEY}/sign-in`);
const SELECT_BRAND = `${KEY}/select-brand`;
const RESET_SIGN_IN = `${KEY}/reset`;

function signIn(data) {
  return async dispatch => dispatch({
    [CALL_API]: {
      endpoint: '/auth/signin/operator',
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

function reset() {
  return { type: RESET_SIGN_IN };
}

const initialState = {
  logged: false,
  brand: null,
  brands: [],
  fullName: null,
  departments: [],
  data: {
    token: null,
    login: null,
    firstName: null,
    lastName: null,
    uuid: null,
    permissions: [],
    departmentsByBrand: {},
  },
};
const actionHandlers = {
  [SIGN_IN.SUCCESS]: (state, action) => {
    const { departmentsByBrand, firstName, lastName } = action.payload;

    const brands = Object.keys(departmentsByBrand);
    const newState = {
      ...state,
      brands: mapBrands(brands),
      fullName: `${firstName} ${lastName}`,
      data: { ...state.data, ...action.payload },
      logged: true,
    };

    if (brands.length === 1) {
      const brandDepartments = departmentsByBrand[brands[0]];
      const departments = Object.keys(brandDepartments);
      newState.brand = newState.brands[0];

      if (departments.length < 2) {
        return newState;
      }

      newState.departments = departments.map(mapDepartments(brandDepartments));
    }

    return newState;
  },
  [SELECT_BRAND]: (state, action) => {
    if (!action.payload) {
      return {
        ...state,
        brand: null,
        departments: [],
      };
    }

    const { departmentsByBrand } = state.data;
    const { brand } = action.payload;
    const brandDepartments = departmentsByBrand[brand];

    return {
      ...state,
      brand: action.payload,
      departments: Object.keys(brandDepartments).map(mapDepartments(brandDepartments)),
    };
  },
  [RESET_SIGN_IN]: () => ({ ...initialState }),
};
const actionTypes = {
  SIGN_IN,
  SELECT_BRAND,
  RESET_SIGN_IN,
};
const actionCreators = {
  signIn,
  selectBrand,
  reset,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
