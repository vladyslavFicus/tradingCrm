import { CALL_API } from 'redux-api-middleware';
import countryListLib from 'country-list';
import _ from 'lodash';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';

const { getName: getCountryNameByCode } = countryListLib();

function formatPhoneCode(phone) {
  return phone.replace(/[-\s]/g, '');
}

function mergePhoneCodes(current, phone) {
  if (/:/.test(phone)) {
    return [...current, ...phone.split(':').filter(i => !!i)];
  }

  return [...current, phone];
}

const KEY = 'options';
const RESET = `${KEY}/reset`;
const FETCH_SIGN_UP = createRequestAction(`${KEY}/fetch-sign-up`);

function fetchSignUp(brandId) {
  return {
    [CALL_API]: {
      endpoint: `profile/public/signup?brandId=${brandId}`,
      method: 'OPTIONS',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_SIGN_UP.REQUEST,
        FETCH_SIGN_UP.SUCCESS,
        FETCH_SIGN_UP.FAILURE,
      ],
    },
  };
}

function reset() {
  return {
    type: RESET,
  };
}

const initialState = {
  source: {},
  data: {
    countries: [],
    countryCodes: [],
    currencyCodes: [],
    phoneCodes: [],
    passwordPattern: '',
    baseCurrency: '',
  },
  playerMeta: {
    countryCode: null,
    currencyCode: null,
    ip: null,
    phoneCode: null,
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_SIGN_UP.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_SIGN_UP.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => {
    const newState = {
      ...state,
      source: payload,
      playerMeta: payload.geoLocation,
      isLoading: false,
      receivedAt: endRequestTime,
    };

    const phoneCodes = _.get(payload, 'post.phoneCode.list', []);
    const currencyCodes = _.get(payload, 'post.currency.list', []);
    const baseCurrency = _.get(payload, 'post.currency.base', '');
    const countryList = _.get(payload, 'post.country.list', []);
    const passwordPattern = _.get(payload, 'post.password.pattern', '');
    const countryCodes = countryList ? countryList.map(item => item.countryCode) : [];
    const countries = countryList.map(item => ({
      ...item,
      countryName: getCountryNameByCode(item.countryCode),
    })).sort(({ countryName: a }, { countryName: b }) => (a > b ? 1 : -1));

    newState.data = {
      ...state.data,
      phoneCodes: phoneCodes ? phoneCodes
        .reduce((res, item) => (item ? mergePhoneCodes(res, formatPhoneCode(item)) : res), [])
        .filter(i => i)
        .filter((el, i, a) => i === a.indexOf(el))
        .sort() : [],
      currencyCodes: currencyCodes.sort(),
      baseCurrency,
      countries,
      countryCodes,
      passwordPattern,
    };

    return newState;
  },
  [FETCH_SIGN_UP.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    error: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [RESET]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_SIGN_UP,
  RESET,
};
const actionCreators = {
  fetchSignUp,
  reset,
};

export {
  actionCreators,
  actionTypes,
  initialState,
};

export default createReducer(initialState, actionHandlers);
