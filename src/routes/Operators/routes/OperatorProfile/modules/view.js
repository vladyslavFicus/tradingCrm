import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import { sourceActionCreators as operatorSourceActionCreators } from '../../../../../redux/modules/operator';
import createReducer from '../../../../../utils/createReducer';

const KEY = 'operator-profile';
const PROFILE = createRequestAction(`${KEY}/view`);
const CHANGE_STATUS = createRequestAction(`${KEY}/change-status`);
const RESET_PASSWORD = createRequestAction(`${KEY}/reset-password`);
const SEND_INVITATION = createRequestAction(`${KEY}/send-activation`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);

const fetchProfile = operatorSourceActionCreators.fetchProfile(PROFILE);
const resetPassword = operatorSourceActionCreators.passwordResetRequest(RESET_PASSWORD);
const sendInvitation = operatorSourceActionCreators.sendInvitationRequest(SEND_INVITATION);

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
          firstName: operatorProfile.firstName,
          lastName: operatorProfile.lastName,
          phoneNumber: operatorProfile.phoneNumber,
          ...data,
          email: undefined,
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

const successFetchProfileReducer = (state, action) => ({
  ...state,
  data: action.payload,
  isLoading: false,
  receivedAt: timestamp(),
});

const actionHandlers = {
  [PROFILE.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [PROFILE.SUCCESS]: successFetchProfileReducer,
  [PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [UPDATE_PROFILE.SUCCESS]: successFetchProfileReducer,
};

const initialState = {
  data: {
    authorities: [],
    uuid: null,
    email: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    country: null,
    registrationDate: null,
    operatorStatus: null,
    statusChangeDate: null,
    statusChangeAuthor: null,
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
  sendInvitation,
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
