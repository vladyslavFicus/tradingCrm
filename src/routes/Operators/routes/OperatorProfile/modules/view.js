import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import { sourceActionCreators as operatorSourceActionCreators } from '../../../../../redux/modules/operator';
import createReducer from '../../../../../utils/createReducer';

const KEY = 'operator-profile';
const PROFILE = createRequestAction(`${KEY}/view`);
const CHANGE_STATUS = createRequestAction(`${KEY}/change-status`);
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
    const { auth: { token, logged }, operatorProfile: { view: operatorProfile } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: operatorProfile.country,
          email: operatorProfile.email,
          firstName: operatorProfile.firstName,
          lastName: operatorProfile.lastName,
          phoneNumber: operatorProfile.phoneNumber,
          ...data,
        }),
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

function changeStatus(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged, uuid: currentUUID } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'operator/operators/status',
        method: 'PUT',
        types: [
          CHANGE_STATUS.REQUEST,
          CHANGE_STATUS.SUCCESS,
          CHANGE_STATUS.FAILURE,
        ],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          statusChangedAuthor: currentUUID,
        }),
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchProfile(data.uuid)));
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

const initialState = {
  data: {
    authorities: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

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

export default createReducer(initialState, actionHandlers);
