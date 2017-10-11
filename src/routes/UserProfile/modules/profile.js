import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import timestamp from '../../../utils/timestamp';
import { actions, statuses as userStatuses } from '../../../constants/user';
import { statuses as kycStatuses, categories as kycCategories } from '../../../constants/kyc';
import { actionCreators as usersActionCreators } from '../../../redux/modules/users';
import config from '../../../config';

const KEY = 'user-profile/view';
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);
const SUBMIT_KYC = createRequestAction(`${KEY}/submit-kyc`);
const VERIFY_DATA = createRequestAction(`${KEY}/verify-data`);
const VERIFY_KYC_ALL = createRequestAction(`${KEY}/verify-kyc-all`);
const REFUSE_DATA = createRequestAction(`${KEY}/refuse-data`);
const RESET_PASSWORD_REQUEST = createRequestAction(`${KEY}/reset-password-request`);
const RESET_PASSWORD_CONFIRM = createRequestAction(`${KEY}/reset-password-confirm`);
const FETCH_RESET_PASSWORD_TOKEN = createRequestAction(`${KEY}/fetch-reset-password-token`);
const ACTIVATE_PROFILE = createRequestAction(`${KEY}/activate-profile`);

const SUSPEND_PROFILE = createRequestAction(`${KEY}/suspend-profile`);
const PROLONG_PROFILE = createRequestAction(`${KEY}/prolong-profile`);
const BLOCK_PROFILE = createRequestAction(`${KEY}/block-profile`);
const UNBLOCK_PROFILE = createRequestAction(`${KEY}/unblock-profile`);
const RESUME_PROFILE = createRequestAction(`${KEY}/resume-profile`);

const VERIFY_PROFILE_PHONE = createRequestAction(`${KEY}/verify-profile-phone`);
const VERIFY_PROFILE_EMAIL = createRequestAction(`${KEY}/verify-profile-email`);

const UPDATE_SUBSCRIPTION = createRequestAction(`${KEY}/update-subscription`);

const ADD_TAG = createRequestAction(`${KEY}/add-tag`);
const DELETE_TAG = createRequestAction(`${KEY}/delete-tag`);

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
    marketingNews: false,
    marketingMail: false,
    token: null,
    tokenExpirationDate: null,
    profileStatus: null,
    profileStatusReason: null,
    suspendEndDate: null,
    birthDate: null,
    registrationDate: null,
    tags: [],
    kycCompleted: false,
    balance: { amount: 0, currency: config.nas.currencies.base },
    realBalance: { amount: 0, currency: config.nas.currencies.base },
    bonusBalance: { amount: 0, currency: config.nas.currencies.base },
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

const fetchProfile = usersActionCreators.fetchProfile(FETCH_PROFILE);
const resetPassword = usersActionCreators.passwordResetRequest(RESET_PASSWORD_REQUEST);
const resetPasswordConfirm = usersActionCreators.passwordResetConfirm(RESET_PASSWORD_CONFIRM);
const fetchResetPasswordToken = usersActionCreators.fetchResetPasswordToken(FETCH_RESET_PASSWORD_TOKEN);
const activateProfile = usersActionCreators.profileActivateRequest(ACTIVATE_PROFILE);

function updateProfile(uuid, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
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

function updateContacts(uuid, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
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

function updateSubscription(playerUUID, data, updatedSubscription) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function submitData(playerUUID, type, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

function addTag(playerUUID, tag, priority) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/tags`,
        method: 'POST',
        types: [ADD_TAG.REQUEST, ADD_TAG.SUCCESS, ADD_TAG.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tag,
          tagPriority: priority,
        }),
        bailout: !logged,
      },
    });
  };
}

function deleteTag(playerUUID, id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/tags/${id}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [DELETE_TAG.REQUEST, DELETE_TAG.SUCCESS, DELETE_TAG.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function verifyData(playerUUID, type) {
  return (dispatch, getState) => {
    const { auth: { token, logged, uuid, notifications: { email } } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}/verify${!email ? '?send-mail=false' : ''}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    const { auth: { token, logged, uuid, notifications: { email } } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/verify${!email ? '?send-mail=false' : ''}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    const { auth: { token, logged, uuid, notifications: { email } } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}${!email ? '?send-mail=false' : ''}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/suspend`,
        method: 'PUT',
        types: [SUSPEND_PROFILE.REQUEST, SUSPEND_PROFILE.SUCCESS, SUSPEND_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function prolongProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/suspend/prolong`,
        method: 'PUT',
        types: [PROLONG_PROFILE.REQUEST, PROLONG_PROFILE.SUCCESS, PROLONG_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function blockProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/block`,
        method: 'PUT',
        types: [BLOCK_PROFILE.REQUEST, BLOCK_PROFILE.SUCCESS, BLOCK_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function unblockProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/unblock`,
        method: 'PUT',
        types: [UNBLOCK_PROFILE.REQUEST, UNBLOCK_PROFILE.SUCCESS, UNBLOCK_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function resumeProfile({ playerUUID, ...data }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/resume`,
        method: 'PUT',
        types: [RESUME_PROFILE.REQUEST, RESUME_PROFILE.SUCCESS, RESUME_PROFILE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        bailout: !logged,
      },
    });
  };
}

function verifyPhone(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/verification/${playerUUID}/phone`,
        method: 'POST',
        types: [VERIFY_PROFILE_PHONE.REQUEST, VERIFY_PROFILE_PHONE.SUCCESS, VERIFY_PROFILE_PHONE.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        bailout: !logged,
      },
    });
  };
}

function verifyEmail(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/verification/${playerUUID}`,
        method: 'POST',
        types: [VERIFY_PROFILE_EMAIL.REQUEST, VERIFY_PROFILE_EMAIL.SUCCESS, VERIFY_PROFILE_EMAIL.FAILURE],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
    } else if (action === actions.UNBLOCK) {
      return dispatch(unblockProfile(data));
    } else if (action === actions.PROLONG) {
      return dispatch(prolongProfile(data));
    } else if (action === actions.SUSPEND) {
      return dispatch(suspendProfile(data));
    } else if (action === actions.REMOVE) {
      return dispatch(resumeProfile(data));
    }

    throw new Error(`Unknown status change action "${action}".`);
  };
}

function optimisticKycRequestActionReducer(state, action) {
  const {
    date,
    status,
    authorUUID,
    kycRequestReason,
  } = action.payload;
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
      receivedAt: timestamp(),
    },
  };
}

function optimisticVerifyKycActionReducer(state, action) {
  const {
    type,
    date,
    authorUUID,
    status,
  } = action.payload;

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
      receivedAt: timestamp(),
    },
  };
}

function optimisticVerifyKycAllActionReducer(state, action) {
  const {
    date,
    authorUUID,
    status,
  } = action.payload;

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
      receivedAt: timestamp(),
    },
  };
}

function optimisticRefuseKycActionReducer(state, action) {
  const {
    type,
    date,
    authorUUID,
    status,
    reason,
  } = action.payload;

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
      receivedAt: timestamp(),
    },
  };
}

function successUpdateStatusReducer(state, action) {
  return {
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  };
}

function successUpdateProfileReducer(state, action) {
  return {
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
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
    const { auth: { token, logged, uuid, notifications: { email } } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/kyc/${playerUUID}/request${!email ? '?send-mail=false' : ''}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
  [ADD_TAG.SUCCESS]: (state, action) => {
    const { profileTags } = action.payload;

    if (!profileTags || !Array.isArray(profileTags)) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        tags: profileTags.length > 0
          ? profileTags.map(tag => ({ id: tag.id, tag: tag.tag, priority: tag.tagPriority }))
          : [],
      },
    };
  },
  [DELETE_TAG.SUCCESS]: (state, action) => {
    const { profileTags } = action.payload;

    if (!profileTags || !Array.isArray(profileTags)) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        tags: profileTags.length > 0
          ? profileTags.map(tag => ({ id: tag.id, tag: tag.tag, priority: tag.tagPriority }))
          : [],
      },
    };
  },
  [FETCH_PROFILE.REQUEST]: state => ({
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
  [UPDATE_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [BLOCK_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [SUSPEND_PROFILE.SUCCESS]: successUpdateStatusReducer,
  [UNBLOCK_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [PROLONG_PROFILE.SUCCESS]: successUpdateStatusReducer,
  [RESUME_PROFILE.SUCCESS]: successUpdateStatusReducer,
  [SUBMIT_KYC.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [SUBMIT_KYC.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      ...action.payload,
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [SUBMIT_KYC.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
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
  ADD_TAG,
  DELETE_TAG,
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
  updateContacts,
  resetPassword,
  resetPasswordConfirm,
  fetchResetPasswordToken,
  activateProfile,
  updateSubscription,
  changeStatus,
  addTag,
  deleteTag,
  verifyPhone,
  verifyEmail,
  sendKycRequestVerification,
  manageKycNote,
  resetNote,
  fetchKycReasons,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
