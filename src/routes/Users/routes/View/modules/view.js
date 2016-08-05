import { WEB_API } from '../../../../../constants';
import { getTimestamp } from 'utils/helpers';

const KEY = 'user-profile';
const PROFILE_REQUEST = `${KEY}/view-request`;
const PROFILE_SUCCESS = `${KEY}/view-success`;
const PROFILE_FAILURE = `${KEY}/view-failure`;

function loadProfile(uuid) {
  return (dispatch, getState) => {
    const { auth } = getState();
    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
        endpoint: `profile/profiles/${uuid}`,
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      },
    });
  };
}

const actionHandlers = {
  [PROFILE_REQUEST]: (state, action) => ({ ...state, data: { ...action.response }, isLoading: true, isFailed: false }),
  [PROFILE_SUCCESS]: (state, action) => ({
    ...state,
    data: { ...action.response },
    isLoading: false,
    receivedAt: getTimestamp()
  }),
  [PROFILE_FAILURE]: (state, action) => ({ ...state, isLoading: false, isFailed: true, receivedAt: getTimestamp() }),
};

const initialState = {
  data: {
    id: null,
    username: null,
    email: null,
    currency: null,
    balance: null,
  },
  isLoading: false,
  isFailed: false,
  receivedAt: null
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
};

const actionCreators = {
  loadProfile,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
