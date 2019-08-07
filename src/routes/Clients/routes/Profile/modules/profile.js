import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actions, statuses as userStatuses } from '../../../../../constants/user';
import { statuses as kycStatuses, categories as kycCategories } from '../../../../../constants/kyc';
import { actionCreators as profileActionCreators } from '../../../../../redux/modules/profile';
import { actionCreators as authActionCreators } from '../../../../../redux/modules/auth';

const KEY = 'user-profile/view';
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);
const UPDATE_EMAIL = createRequestAction(`${KEY}/update-email`);
const SUBMIT_KYC = createRequestAction(`${KEY}/submit-kyc`);
const VERIFY_DATA = createRequestAction(`${KEY}/verify-data`);
const VERIFY_KYC_ALL = createRequestAction(`${KEY}/verify-kyc-all`);
const REFUSE_DATA = createRequestAction(`${KEY}/refuse-data`);
const RESET_PASSWORD_REQUEST = createRequestAction(`${KEY}/reset-password-request`);
const RESET_PASSWORD_CONFIRM = createRequestAction(`${KEY}/reset-password-confirm`);
const FETCH_RESET_PASSWORD_TOKEN = createRequestAction(`${KEY}/fetch-reset-password-token`);
const ACTIVATE_PROFILE = createRequestAction(`${KEY}/activate-profile`);
const CHANGE_PASSWORD = createRequestAction(`${KEY}/change-password`);

const SUSPEND_PROFILE = createRequestAction(`${KEY}/suspend-profile`);
const PROLONG_PROFILE = createRequestAction(`${KEY}/prolong-profile`);
const BLOCK_PROFILE = createRequestAction(`${KEY}/block-profile`);
const UNBLOCK_PROFILE = createRequestAction(`${KEY}/unblock-profile`);
const RESUME_PROFILE = createRequestAction(`${KEY}/resume-profile`);

const VERIFY_PROFILE_PHONE = createRequestAction(`${KEY}/verify-profile-phone`);
const VERIFY_PROFILE_EMAIL = createRequestAction(`${KEY}/verify-profile-email`);

const UPDATE_SUBSCRIPTION = createRequestAction(`${KEY}/update-subscription`);

const SEND_KYC_REQUEST_VERIFICATION = createRequestAction(`${KEY}/send-kyc-request-verification`);
const MANAGE_KYC_NOTE = `${KEY}/manage-kyc-request-note`;
const RESET_KYC_NOTE = `${KEY}/reset-kyc-request-note`;

const FETCH_KYC_REASONS = createRequestAction(`${KEY}/fetch-kyc-reasons`);

const initialState = {
  data: {
    id: null,
    playerUUID: null,
    acceptedTermsUUID: null,
    login: null,
    fullName: null,
    firstName: null,
    lastName: null,
    email: null,
    registrationIP: null,
    address: null,
    identifier: null,
    title: null,
    gender: null,
    country: null,
    city: null,
    postCode: null,
    languageCode: null,
    currencyCode: null,
    phoneNumber: null,
    phone: null,
    phoneCode: null,
    phoneNumberVerified: false,
    affiliateId: null,
    btag: null,
    marketingSMS: false,
    marketingMail: false,
    token: null,
    tokenExpirationDate: null,
    profileStatus: null,
    profileStatusReason: null,
    suspendEndDate: null,
    birthDate: null,
    registrationDate: null,
    kycCompleted: false,
    balance: { amount: 0, currency: 'EUR' },
    realBalance: { amount: 0, currency: 'EUR' },
    bonusBalance: { amount: 0, currency: 'EUR' },
    kycAddressStatus: null,
    kycPersonalStatus: null,
    kycRequest: null,
    signInIps: [],
  },
  kycReasons: {
    refuse: [],
    request: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
  notes: {
    kycRequest: null,
    refuse: null,
    verify: null,
    verifyAll: null,
  },
};

const fetchProfile = profileActionCreators.fetchProfile(FETCH_PROFILE);
const activateProfile = profileActionCreators.profileActivateRequest(ACTIVATE_PROFILE);

const resetPassword = authActionCreators.passwordResetRequest(RESET_PASSWORD_REQUEST);
const resetPasswordConfirm = authActionCreators.passwordResetConfirm(RESET_PASSWORD_CONFIRM);

function changePassword(uuid, password) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${uuid}/password`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        types: [
          CHANGE_PASSWORD.REQUEST,
          CHANGE_PASSWORD.SUCCESS,
          CHANGE_PASSWORD.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function updateProfile(uuid, data) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [
          UPDATE_PROFILE.REQUEST,
          {
            type: UPDATE_PROFILE.SUCCESS,
            payload: data,
          },
          UPDATE_PROFILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function updatePhone(uuid, data) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [
          UPDATE_PROFILE.REQUEST,
          {
            type: UPDATE_PROFILE.SUCCESS,
            payload: {
              ...data,
              phoneNumberVerified: false,
              phoneNumber: `${data.phoneCode}${data.phone}`,
            },
          },
          UPDATE_PROFILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function updateEmail(uuid, data) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}/email`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [
          UPDATE_EMAIL.REQUEST,
          {
            type: UPDATE_EMAIL.SUCCESS,
            payload: data,
          },
          UPDATE_EMAIL.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function updateSubscription(playerUUID, data, updatedSubscription) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/subscription`,
        method: 'PUT',
        types: [
          { type: UPDATE_SUBSCRIPTION.REQUEST, payload: { updatedSubscription, data } },
          UPDATE_SUBSCRIPTION.SUCCESS,
          { type: UPDATE_SUBSCRIPTION.FAILURE, payload: { updatedSubscription, data } },
        ],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function submitData(playerUUID, type, data) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [
          SUBMIT_KYC.REQUEST,
          {
            type: SUBMIT_KYC.SUCCESS,
            payload: {
              ...data,
              playerUUID,
            },
          },
          SUBMIT_KYC.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function verifyData(playerUUID, type) {
  return (dispatch, getState) => {
    const { auth: { logged, uuid }, settings: { sendMail } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}/verify${!sendMail ? '?send-mail=false' : ''}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          VERIFY_DATA.REQUEST,
          {
            type: VERIFY_DATA.SUCCESS,
            payload: {
              type: type === kycCategories.KYC_ADDRESS ? 'kycAddressStatus' : 'kycPersonalStatus',
              authorUUID: uuid,
              date: moment().format('YYYY-MM-DDTHH:mm:ss'),
              status: kycStatuses.VERIFIED,
            },
          },
          VERIFY_DATA.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function verifyKycAll(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { logged, uuid }, settings: { sendMail } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/verify${!sendMail ? '?send-mail=false' : ''}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          VERIFY_KYC_ALL.REQUEST,
          {
            type: VERIFY_KYC_ALL.SUCCESS,
            payload: {
              authorUUID: uuid,
              date: moment().format('YYYY-MM-DDTHH:mm:ss'),
              status: kycStatuses.VERIFIED,
            },
          },
          VERIFY_KYC_ALL.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function refuseData(playerUUID, type, data) {
  return (dispatch, getState) => {
    const { auth: { logged, uuid }, settings: { sendMail } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}${!sendMail ? '?send-mail=false' : ''}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [
          REFUSE_DATA.REQUEST,
          {
            type: REFUSE_DATA.SUCCESS,
            payload: {
              type: type === kycCategories.KYC_ADDRESS ? 'kycAddressStatus' : 'kycPersonalStatus',
              status: kycStatuses.PENDING,
              reason: data.reason,
              data: moment().format('YYYY-MM-DDTHH:mm:ss'),
              authorUUID: uuid,
            },
          },
          REFUSE_DATA.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function suspendProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/suspend`,
        method: 'PUT',
        types: [SUSPEND_PROFILE.REQUEST, SUSPEND_PROFILE.SUCCESS, SUSPEND_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function prolongProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/suspend/prolong`,
        method: 'PUT',
        types: [PROLONG_PROFILE.REQUEST, PROLONG_PROFILE.SUCCESS, PROLONG_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function blockProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/block`,
        method: 'PUT',
        types: [BLOCK_PROFILE.REQUEST, BLOCK_PROFILE.SUCCESS, BLOCK_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function unblockProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/unblock`,
        method: 'PUT',
        types: [UNBLOCK_PROFILE.REQUEST, UNBLOCK_PROFILE.SUCCESS, UNBLOCK_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function resumeProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/resume`,
        method: 'PUT',
        types: [RESUME_PROFILE.REQUEST, RESUME_PROFILE.SUCCESS, RESUME_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function verifyPhone(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/verification/${playerUUID}/phone`,
        method: 'POST',
        types: [VERIFY_PROFILE_PHONE.REQUEST, VERIFY_PROFILE_PHONE.SUCCESS, VERIFY_PROFILE_PHONE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        bailout: !logged,
      },
    });
  };
}

function verifyEmail(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/verification/${playerUUID}/email`,
        method: 'POST',
        types: [VERIFY_PROFILE_EMAIL.REQUEST, VERIFY_PROFILE_EMAIL.SUCCESS, VERIFY_PROFILE_EMAIL.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        bailout: !logged,
      },
    });
  };
}

function fetchKycReasons() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'profile/kyc/reasons',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          FETCH_KYC_REASONS.REQUEST,
          FETCH_KYC_REASONS.SUCCESS,
          FETCH_KYC_REASONS.FAILURE,
        ],
        bailout: !logged || !token,
      },
    });
  };
}

function changeStatus({ action, ...data }) {
  return (dispatch) => {
    if (action === actions.BLOCK) {
      return dispatch(blockProfile(data));
    } if (action === actions.UNBLOCK) {
      return dispatch(unblockProfile(data));
    } if (action === actions.PROLONG) {
      return dispatch(prolongProfile(data));
    } if (action === actions.SUSPEND) {
      return dispatch(suspendProfile(data));
    } if (action === actions.REMOVE) {
      return dispatch(resumeProfile(data));
    }

    throw new Error(`Unknown status change action "${action}".`);
  };
}

function optimisticKycRequestActionReducer(state, { payload, meta: { endRequestTime } }) {
  const {
    date,
    status,
    authorUUID,
    kycRequestReason,
  } = payload;
  return {
    ...state,
    data: {
      ...state.data,
      kycCompleted: false,
      kycPersonalStatus: {
        statusDate: date,
        reason: '',
        authorUUID,
        status,
      },
      kycAddressStatus: {
        statusDate: date,
        reason: '',
        authorUUID,
        status,
      },
      kycRequest: {
        reason: kycRequestReason,
        authorUUID,
        requestDate: date,
      },
      isLoading: false,
      receivedAt: endRequestTime,
    },
  };
}

function optimisticVerifyKycActionReducer(state, { payload, meta: { endRequestTime } }) {
  const {
    type,
    date,
    authorUUID,
    status,
  } = payload;

  const otherKycStatus = type === 'kycPersonalStatus' ? 'kycAddressStatus' : 'kycPersonalStatus';
  const kycCompleted = state.data[otherKycStatus] && state.data[otherKycStatus].status === kycStatuses.VERIFIED;

  return {
    ...state,
    data: {
      ...state.data,
      kycCompleted,
      [type]: {
        ...state.data[type],
        authorUUID,
        statusDate: date,
        status,
      },
      isLoading: false,
      receivedAt: endRequestTime,
    },
  };
}

function optimisticVerifyKycAllActionReducer(state, { payload, meta: { endRequestTime } }) {
  const {
    date,
    authorUUID,
    status,
  } = payload;

  const verifiedStatusEntity = {
    reason: '',
    statusDate: date,
    authorUUID,
    status,
  };
  return {
    ...state,
    data: {
      ...state.data,
      kycCompleted: true,
      kycAddressStatus: verifiedStatusEntity,
      kycPersonalStatus: verifiedStatusEntity,
      isLoading: false,
      receivedAt: endRequestTime,
    },
  };
}

function optimisticRefuseKycActionReducer(state, { payload, meta: { endRequestTime } }) {
  const {
    type,
    date,
    authorUUID,
    status,
    reason,
  } = payload;

  return {
    ...state,
    data: {
      ...state.data,
      [type]: {
        ...state.data[type],
        authorUUID,
        statusDate: date,
        reason,
        status,
      },
      kycCompleted: false,
      isLoading: false,
      receivedAt: endRequestTime,
    },
  };
}

function successUpdateStatusReducer(state, { payload, meta: { endRequestTime } }) {
  return {
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
    isLoading: false,
    receivedAt: endRequestTime,
  };
}

function successUpdateProfileReducer(state, { payload, meta: { endRequestTime } }) {
  return {
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
    isLoading: false,
    receivedAt: endRequestTime,
  };
}

function manageKycNote(type, data) {
  return (dispatch, getState) => {
    const { auth: { uuid, fullName } } = getState();

    return dispatch({
      type: MANAGE_KYC_NOTE,
      meta: {
        noteType: type,
      },
      payload: data !== null ? {
        ...data,
        author: fullName,
        creatorUUID: uuid,
        lastEditorUUID: uuid,
      } : data,
    });
  };
}

function sendKycRequestVerification(playerUUID, params) {
  return (dispatch, getState) => {
    const { auth: { logged, uuid }, settings: { sendMail } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/kyc/${playerUUID}/request${!sendMail ? '?send-mail=false' : ''}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        types: [
          SEND_KYC_REQUEST_VERIFICATION.REQUEST,
          {
            type: SEND_KYC_REQUEST_VERIFICATION.SUCCESS,
            payload: {
              status: kycStatuses.PENDING,
              date: moment().format('YYYY-MM-DDTHH:mm:ss'),
              authorUUID: uuid,
              kycRequestReason: params.reason,
            },
          },
          SEND_KYC_REQUEST_VERIFICATION.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function resetNote(noteType) {
  return {
    type: RESET_KYC_NOTE,
    meta: {
      noteType,
    },
  };
}

const actionHandlers = {
  [UPDATE_SUBSCRIPTION.REQUEST]: (state, action) => {
    const { updatedSubscription, data } = action.payload;

    if (state.data[updatedSubscription] === data[updatedSubscription]) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        [updatedSubscription]: data[updatedSubscription],
      },
    };
  },
  [UPDATE_SUBSCRIPTION.FAILURE]: (state, action) => {
    const { updatedSubscription, data } = action.payload;

    if (state.data[updatedSubscription] !== data[updatedSubscription]) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        [updatedSubscription]: !data[updatedSubscription],
      },
    };
  },
  [VERIFY_PROFILE_PHONE.SUCCESS]: state => ({
    ...state,
    data: {
      ...state.data,
      phoneNumberVerified: true,
    },
  }),
  [VERIFY_PROFILE_EMAIL.SUCCESS]: state => ({
    ...state,
    data: {
      ...state.data,
      profileStatus: userStatuses.ACTIVE,
    },
  }),
  [FETCH_PROFILE.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_PROFILE.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_PROFILE.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [UPDATE_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [BLOCK_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [SUSPEND_PROFILE.SUCCESS]: successUpdateStatusReducer,
  [UNBLOCK_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [PROLONG_PROFILE.SUCCESS]: successUpdateStatusReducer,
  [RESUME_PROFILE.SUCCESS]: successUpdateStatusReducer,
  [UPDATE_EMAIL.SUCCESS]: successUpdateProfileReducer,
  [SUBMIT_KYC.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [SUBMIT_KYC.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [SUBMIT_KYC.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [VERIFY_DATA.SUCCESS]: optimisticVerifyKycActionReducer,
  [REFUSE_DATA.SUCCESS]: optimisticRefuseKycActionReducer,
  [SEND_KYC_REQUEST_VERIFICATION.SUCCESS]: optimisticKycRequestActionReducer,
  [VERIFY_KYC_ALL.SUCCESS]: optimisticVerifyKycAllActionReducer,
  [MANAGE_KYC_NOTE]: (state, action) => ({
    ...state,
    notes: {
      ...state.notes,
      [action.meta.noteType]: action.payload,
    },
  }),
  [RESET_KYC_NOTE]: (state, action) => ({
    ...state,
    notes: {
      ...state.notes,
      [action.meta.noteType]: null,
    },
  }),
  [FETCH_KYC_REASONS.SUCCESS]: (state, action) => ({
    ...state,
    kycReasons: {
      refuse: Array.isArray(action.payload.refuse) ? action.payload.refuse : [],
      request: Array.isArray(action.payload.request) ? action.payload.request : [],
    },
  }),
};

const actionTypes = {
  FETCH_PROFILE,
  UPDATE_PROFILE,
  SUBMIT_KYC,
  VERIFY_DATA,
  REFUSE_DATA,
  VERIFY_PROFILE_PHONE,
  VERIFY_PROFILE_EMAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_CONFIRM,
  FETCH_RESET_PASSWORD_TOKEN,
};
const actionCreators = {
  fetchProfile,
  submitData,
  verifyData,
  verifyKycAll,
  refuseData,
  updateProfile,
  updatePhone,
  updateEmail,
  resetPassword,
  resetPasswordConfirm,
  activateProfile,
  updateSubscription,
  changeStatus,
  verifyPhone,
  verifyEmail,
  sendKycRequestVerification,
  manageKycNote,
  resetNote,
  fetchKycReasons,
  changePassword,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
