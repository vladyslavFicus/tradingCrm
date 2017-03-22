import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import timestamp from 'utils/timestamp';
import { sourceActionCreators as operatorSourceActionCreators } from 'redux/modules/operator';

const KEY = 'operator-profile';
const PROFILE = createRequestAction(`${KEY}/view`);
const RESET_PASSWORD = createRequestAction(`${KEY}/reset-password`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);

const resetPassword = operatorSourceActionCreators.passwordResetRequest(RESET_PASSWORD);

function fetchProfile(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          PROFILE.REQUEST,
          PROFILE.SUCCESS,
          PROFILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function updateProfile(uuid, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [
          UPDATE_PROFILE.REQUEST,
          UPDATE_PROFILE.SUCCESS,
          UPDATE_PROFILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [PROFILE.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};

function changeStatus() {
  console.log('valid changeStatus not implement by BE');
}

const initialState = {
  data: {
    authorities: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionCreators = {
  fetchProfile,
  updateProfile,
  changeStatus,
  resetPassword,
};

const actionTypes = {
  PROFILE,
  RESET_PASSWORD,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default reducer;
