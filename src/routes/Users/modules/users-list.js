import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';

const KEY = 'users-list';

const USERS_REQUEST = `${KEY}/request`;
const USERS_SUCCESS = `${KEY}/success`;
const USERS_FAILURE = `${KEY}/failure`;

function loadItems(page = 0, filters = {}) {
  return (dispatch, getState) => {
    const { token, uuid } = getState().auth;

    if (!token || !uuid) {
      return { type: false };
    }

    filters = Object.keys(filters).reduce((result, key) => {
      if (filters[key]) {
        result[key] = filters[key];
      }

      return result;
    }, {});

    const endpointParams = { page, ...filters };

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE],
        endpoint: 'profile/profiles',
        endpointParams,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      page,
      filters,
    });
  };
}

const handlers = {
  [USERS_REQUEST]: (state, action) => ({
    ...state,
    filters: { ...state.filters, ...action.filters },
    isLoading: true,
    isFailed: false,
  }),
  [USERS_SUCCESS]: (state, action) => ({
    ...state,
    users: { ...action.response, },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [USERS_FAILURE]: (state, action) => ({
    ...state, isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  users: {
    first: null,
    last: null,
    number: null,
    numberOfElements: null,
    size: null,
    sort: null,
    totalElements: null,
    totalPages: null,
    content: [],
  },
  filters: {},
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = handlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  USERS_REQUEST,
  USERS_SUCCESS,
  USERS_FAILURE,
};

const actionCreators = {
  loadItems,
};

export { actionCreators, actionTypes };

export default reducer;
