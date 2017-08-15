import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import timestamp from '../../../utils/timestamp';
import { actions } from '../../../constants/user';
import { statuses } from '../../../constants/kyc';
import { actionCreators as usersActionCreators } from '../../../redux/modules/users';
import config from '../../../config';

const KEY = 'user-profile/view';
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);
const SUBMIT_KYC = createRequestAction(`${KEY}/submit-kyc`);
const VERIFY_DATA = createRequestAction(`${KEY}/verify-data`);
const REFUSE_DATA = createRequestAction(`${KEY}/refuse-data`);
const RESET_PASSWORD = createRequestAction(`${KEY}/reset-password`);
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
const MANAGE_KYC_REQUEST_NOTE = `${KEY}/manage-kyc-request-note`;
const RESET_KYC_REQUEST_NOTE = `${KEY}/reset-kyc-request-note`;

const initialState = {
  data: {
    id: null,
    playerUUID: null,
    acceptedTermsUUID: null,
    username: null,
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
  error: null,
  isLoading: false,
  receivedAt: null,
  kycRequestNote: null,
};

const fetchProfile = usersActionCreators.fetchProfile(FETCH_PROFILE);
const updateProfile = usersActionCreators.updateProfile(UPDATE_PROFILE);
const resetPassword = usersActionCreators.passwordResetRequest(RESET_PASSWORD);
const activateProfile = usersActionCreators.profileActivateRequest(ACTIVATE_PROFILE);

function updateSubscription(playerUUID, name, value) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/subscription`,
        method: 'PUT',
        types: [
          { type: UPDATE_SUBSCRIPTION.REQUEST, payload: { name, value } },
          UPDATE_SUBSCRIPTION.SUCCESS,
          { type: UPDATE_SUBSCRIPTION.FAILURE, payload: { name, value } },
        ],
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [name]: value }),
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
          SUBMIT_KYC.SUCCESS,
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
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}/verify`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          VERIFY_DATA.REQUEST,
          VERIFY_DATA.SUCCESS,
          VERIFY_DATA.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function refuseData(playerUUID, type, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/kyc/${playerUUID}/${type}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          REFUSE_DATA.REQUEST,
          REFUSE_DATA.SUCCESS,
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
    } else if (action === actions.RESUME) {
      return dispatch(resumeProfile(data));
    }

    throw new Error(`Unknown status change action "${action}".`);
  };
}

function successKycActionReducer(state, action) {
  const {
    kycPersonalStatus,
    kycAddressStatus,
    kycRequest,
  } = action.payload;

  return {
    ...state,
    data: {
      ...state.data,
      kycCompleted: kycPersonalStatus && kycPersonalStatus.value === statuses.VERIFIED
      && kycAddressStatus && kycAddressStatus.value === statuses.VERIFIED,
      kycPersonalStatus: {
        authorUUID: kycPersonalStatus.authorUUID,
        reason: kycPersonalStatus.reason,
        status: kycPersonalStatus.status,
        statusDate: kycPersonalStatus.statusDate,
      },
      kycAddressStatus: {
        authorUUID: kycAddressStatus.authorUUID,
        reason: kycAddressStatus.reason,
        status: kycAddressStatus.status,
        statusDate: kycAddressStatus.statusDate,
      },
    },
    kycRequest,
    isLoading: false,
    receivedAt: timestamp(),
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
  const {
    personalStatus: kycPersonalStatus,
    addressStatus: kycAddressStatus,
    firstName,
    lastName,
    birthDate,
    acceptedTermsUUID,
    gender,
    identifier,
    postCode,
    phoneNumber,
    phoneNumberVerified,
    suspendEndDate,
    title,
    country,
    city,
    address,
    email,
    profileStatus,
    profileStatusComment: profileStatusReason,
    username,
    profileTags,
  } = action.payload;

  return {
    ...state,
    data: {
      ...state.data,
      kycCompleted: kycPersonalStatus && kycPersonalStatus.value === statuses.VERIFIED
      && kycAddressStatus && kycAddressStatus.value === statuses.VERIFIED,
      fullName: [firstName, lastName].join(' ').trim(),
      kycPersonalStatus: {
        status: kycPersonalStatus.value,
        statusDate: kycPersonalStatus.editDate,
        authorUUID: kycPersonalStatus.author,
        reason: kycPersonalStatus.reason,
      },
      kycAddressStatus: {
        status: kycAddressStatus.value,
        statusDate: kycAddressStatus.editDate,
        authorUUID: kycAddressStatus.author,
        reason: kycAddressStatus.reason,
      },
      firstName,
      lastName,
      birthDate,
      acceptedTermsUUID,
      email,
      gender,
      identifier,
      postCode,
      phoneNumber,
      phoneNumberVerified,
      suspendEndDate,
      title,
      profileStatus,
      profileStatusReason,
      username,
      country,
      city,
      address,
      tags: profileTags.length > 0
        ? profileTags.map(tag => ({ id: tag.id, tag: tag.tag, priority: tag.tagPriority }))
        : [],
    },
    isLoading: false,
    receivedAt: timestamp(),
  };
}

function manageKycRequestNote(data) {
  return (dispatch, getState) => {
    const { auth: { uuid, fullName } } = getState();

    return dispatch({
      type: MANAGE_KYC_REQUEST_NOTE,
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
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/kyc/${playerUUID}/request`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
        types: [
          SEND_KYC_REQUEST_VERIFICATION.REQUEST,
          SEND_KYC_REQUEST_VERIFICATION.SUCCESS,
          SEND_KYC_REQUEST_VERIFICATION.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function resetNote() {
  return {
    type: RESET_KYC_REQUEST_NOTE,
  };
}

const actionHandlers = {
  [UPDATE_SUBSCRIPTION.REQUEST]: (state, action) => {
    const { name, value } = action.payload;

    if (state.data[name] === value) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        [name]: value,
      },
    };
  },
  [UPDATE_SUBSCRIPTION.FAILURE]: (state, action) => {
    const { name, value } = action.payload;

    if (state.data[name] !== value) {
      return state;
    }

    return {
      ...state,
      data: {
        ...state.data,
        [name]: !value,
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
  [VERIFY_PROFILE_EMAIL.SUCCESS]: successUpdateProfileReducer,
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
  [SUBMIT_KYC.SUCCESS]: successUpdateProfileReducer,
  [SUBMIT_KYC.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [VERIFY_DATA.SUCCESS]: successKycActionReducer,
  [REFUSE_DATA.SUCCESS]: successKycActionReducer,
  [SEND_KYC_REQUEST_VERIFICATION.SUCCESS]: successKycActionReducer,
  [MANAGE_KYC_REQUEST_NOTE]: (state, action) => ({
    ...state,
    kycRequestNote: action.payload,
  }),
  [RESET_KYC_REQUEST_NOTE]: state => ({
    ...state,
    kycRequestNote: null,
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
};
const actionCreators = {
  fetchProfile,
  submitData,
  verifyData,
  refuseData,
  updateProfile,
  resetPassword,
  activateProfile,
  updateSubscription,
  changeStatus,
  addTag,
  deleteTag,
  verifyPhone,
  verifyEmail,
  sendKycRequestVerification,
  manageKycRequestNote,
  resetNote,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
