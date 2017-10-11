import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../utils/createRequestAction';
import createReducer from '../../../utils/createReducer';
import timestamp from '../../../utils/timestamp';

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
      endpoint: 'profile/public/metainfo',
      method: 'GET',
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
  data: {
    phoneCodes: [],
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
  [FETCH_META.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      phoneCodes: action.payload
        .reduce((res, item) => item ? mergePhoneCodes(res, formatPhoneCode(item.phoneCode)) : res, [])
        .filter(i => i)
        .filter((el, i, a) => i === a.indexOf(el))
        .sort(),
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_META.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
    isLoading: false,
    receivedAt: timestamp(),
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
