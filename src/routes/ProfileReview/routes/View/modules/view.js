import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';
import { actionCreators as usersActionCreators } from 'redux/modules/users';

const KEY = 'user-review';
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const PROFILE_APPROVE = createRequestAction(`${KEY}/profile-approve`);
const PROFILE_REJECT = createRequestAction(`${KEY}/profile-reject`);

function fetchProfile(uuid) {
  return usersActionCreators.fetchProfile(FETCH_PROFILE)(uuid);
}

function approveProfile(profileId) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${profileId}/approve`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          PROFILE_APPROVE.REQUEST,
          PROFILE_APPROVE.SUCCESS,
          PROFILE_APPROVE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function rejectProfile(profileId, reason) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${profileId}/reject?reason=${reason}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          PROFILE_REJECT.REQUEST,
          PROFILE_REJECT.SUCCESS,
          PROFILE_REJECT.FAILURE,
        ],
        bailout: !logged,
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
    error: null,
  }),
  [FETCH_PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
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
