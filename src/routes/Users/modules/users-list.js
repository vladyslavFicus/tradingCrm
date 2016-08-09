import { WEB_API } from 'constants/index';

const KEY = 'users-list';

const USERS_REQUEST = `${KEY}/request`;
const USERS_SUCCESS = `${KEY}/success`;
const USERS_FAILURE = `${KEY}/failure`;

function loadItems(page = 0) {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE],
        endpoint: 'profile/profiles',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  }
}

const handlers = {
  [USERS_REQUEST]: (state, action) => ({ ...state, isLoading: true }),
  [USERS_SUCCESS]: (state, action) => ({
    ...state,
    items: action.response,
    isLoading: false,
  }),
  [USERS_FAILURE]: (state, action) => ({ ...state, isLoading: false }),
};

const initialState = {
  items: [],
  isLoading: false,
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
  loadItems
};

export { actionCreators, actionTypes };

export default reducer;
