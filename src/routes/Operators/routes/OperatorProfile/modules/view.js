import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';
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

const updateProfile = operatorSourceActionCreators.updateProfile(UPDATE_PROFILE);

function changeStatus(data) {
  return (dispatch, getState) => {
    const { auth: { logged, uuid: currentUUID } } = getState();

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

const successFetchProfileReducer = (state, { payload, meta: { endRequestTime } }) => ({
  ...state,
  data: payload,
  isLoading: false,
  receivedAt: endRequestTime,
});

const actionHandlers = {
  [PROFILE.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [PROFILE.SUCCESS]: successFetchProfileReducer,
  [PROFILE.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
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
