import { WEB_API } from 'constants/index';
import { getTimestamp } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'user-review';
const FETCH_PROFILE = createRequestTypes(`${KEY}/fetch-profile`);
const PROFILE_APPROVE = createRequestTypes(`${KEY}/profile-approve`);
const PROFILE_REJECT = createRequestTypes(`${KEY}/profile-reject`);

function fetchProfile(uuid) {
  return (dispatch, getState) => {
    const { auth } = getState();

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [FETCH_PROFILE.REQUEST, FETCH_PROFILE.SUCCESS, FETCH_PROFILE.FAILURE],
        endpoint: `profile/profiles/${uuid}`,
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      },
    });
  };
}

function approveProfile(profileId) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'PUT',
        types: [
          PROFILE_APPROVE.REQUEST,
          PROFILE_APPROVE.SUCCESS,
          PROFILE_APPROVE.FAILURE,
        ],
        endpoint: `profile/kyc/${profileId}/approve`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function rejectProfile(profileId, reason) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'PUT',
        types: [
          PROFILE_REJECT.REQUEST,
          PROFILE_REJECT.SUCCESS,
          PROFILE_REJECT.FAILURE,
        ],
        endpoint: `profile/kyc/${profileId}/reject?reason=${reason}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

const initialState = {
  data: {
    id: null,
    username: null,
    email: null,
    currency: null,
    balance: null,
    kycMetaData: [],
    firstName: null,
    lastName: null,
    address: null,
  },
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};

const actionHandlers = {
  [FETCH_PROFILE.REQUEST]: (state, action) => ({
    ...state,
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.response,
    },
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [FETCH_PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  FETCH_PROFILE,
};
const actionCreators = {
  fetchProfile,
  approveProfile,
  rejectProfile,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
