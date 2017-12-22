import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import countryListLib from 'country-list';
import createRequestAction from '../../../utils/createRequestAction';
import createReducer from '../../../utils/createReducer';
import { getBrand } from '../../../config';

function formatPhoneCode(phone) {
  return phone.replace(/[-\s]/g, '');
}

function mergePhoneCodes(current, phone) {
  if (/:/.test(phone)) {
    return [...current, ...phone.split(':').filter(i => !!i)];
  }

  return [...current, phone];
}

const KEY = 'player-profile/meta';
const FETCH_META = createRequestAction(`${KEY}/fetch-meta`);

function fetchMeta() {
  return {
    [CALL_API]: {
      endpoint: `profile/public/signup?brandId=${getBrand()}`,
      method: 'OPTIONS',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      types: [
        FETCH_META.REQUEST,
        FETCH_META.SUCCESS,
        FETCH_META.FAILURE,
      ],
    },
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
  [FETCH_META.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_META.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => {
    const newState = {
      ...state,
      source: payload,
      playerMeta: payload.geoLocation,
      isLoading: false,
      receivedAt: endRequestTime,
    };

    const phoneCodes = _.get(payload, 'post.phoneCode.list', []);
    const currencyCodes = _.get(payload, 'post.currency.list', []);
    const countryList = _.get(payload, 'post.country.list', []);
    const passwordPattern = _.get(payload, 'post.password.pattern', '');
    const countryCodes = countryList ? countryList.map(item => item.countryCode) : [];
    const countries = countryList.map(item => ({
      ...item,
      countryName: countryListLib().getName(item.countryCode),
    }));

    newState.data = {
      ...state.data,
      phoneCodes: phoneCodes ? phoneCodes
        .reduce((res, item) => item ? mergePhoneCodes(res, formatPhoneCode(item)) : res, [])
        .filter(i => i)
        .filter((el, i, a) => i === a.indexOf(el))
        .sort() : [],
      currencyCodes,
      countries,
      countryCodes,
      passwordPattern,
    };

    return newState;
  },
  [FETCH_META.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    error: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
};
const actionTypes = {
  FETCH_META,
};
const actionCreators = {
  fetchMeta,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
