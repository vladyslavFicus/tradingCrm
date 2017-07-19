import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../utils/createReducer';
import createRequestAction from '../../../utils/createRequestAction';
import timestamp from '../../../utils/timestamp';
import { shortify } from '../../../utils/uuid';
import buildFormData from '../../../utils/buildFormData';
import { actions } from '../../../constants/user';
import { actions as filesActions, categories as filesCategories } from '../../../constants/files';
import { actionCreators as usersActionCreators } from '../../../redux/modules/users';
import { sourceActionCreators as filesSourceActionCreators } from '../../../redux/modules/files';
import { actionTypes as userProfileFilesActionTypes } from './files';
import config from '../../../config';

const KEY = 'user-profile/view';
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const UPDATE_PROFILE = createRequestAction(`${KEY}/update`);
const SUBMIT_KYC = createRequestAction(`${KEY}/submit-kyc`);
const VERIFY_DATA = createRequestAction(`${KEY}/verify-data`);
const REFUSE_DATA = createRequestAction(`${KEY}/refuse-data`);
const UPDATE_IDENTIFIER = createRequestAction(`${KEY}/update-identifier`);
const FETCH_BALANCES = createRequestAction(`${KEY}/fetch-balances`);
const RESET_PASSWORD = createRequestAction(`${KEY}/reset-password`);
const ACTIVATE_PROFILE = createRequestAction(`${KEY}/activate-profile`);

const UPLOAD_FILE = createRequestAction(`${KEY}/upload-file`);
const VERIFY_FILE = createRequestAction(`${KEY}/verify-file`);
const REFUSE_FILE = createRequestAction(`${KEY}/refuse-file`);

const SUSPEND_PROFILE = createRequestAction(`${KEY}/suspend-profile`);
const BLOCK_PROFILE = createRequestAction(`${KEY}/block-profile`);
const UNBLOCK_PROFILE = createRequestAction(`${KEY}/unblock-profile`);

const VERIFY_PROFILE_PHONE = createRequestAction(`${KEY}/verify-profile-phone`);
const VERIFY_PROFILE_EMAIL = createRequestAction(`${KEY}/verify-profile-email`);

const UPDATE_SUBSCRIPTION = createRequestAction(`${KEY}/update-subscription`);

const ADD_TAG = createRequestAction(`${KEY}/add-tag`);
const DELETE_TAG = createRequestAction(`${KEY}/delete-tag`);

const initialState = {
  data: {
    id: null,
    acceptedTermsId: null,
    username: null,
    uuid: null,
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
    profileStatusComment: null,
    suspendEndDate: null,
    birthDate: null,
    registrationDate: null,
    profileTags: [],
    kycCompleted: false,
    completed: false,
    balance: { amount: 0, currency: config.nas.currencies.base },
    realBalance: { amount: 0, currency: config.nas.currencies.base },
    bonusBalance: { amount: 0, currency: config.nas.currencies.base },
    kycAddressStatus: {
      status: null,
      statusDate: null,
      authorUUID: null,
      reason: null,
    },
    kycPersonalStatus: {
      status: null,
      statusDate: null,
      authorUUID: null,
      reason: null,
    },
    personalKycMetaData: [],
    addressKycMetaData: [],
    signInIps: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

const fetchProfile = usersActionCreators.fetchProfile(FETCH_PROFILE);
const updateProfile = usersActionCreators.updateProfile(UPDATE_PROFILE);
const updateIdentifier = usersActionCreators.updateIdentifier(UPDATE_IDENTIFIER);
const resetPassword = usersActionCreators.passwordResetRequest(RESET_PASSWORD);
const activateProfile = usersActionCreators.profileActivateRequest(ACTIVATE_PROFILE);
const changeFileStatusByAction = filesSourceActionCreators.changeStatusByAction({
  [filesActions.VERIFY]: VERIFY_FILE,
  [filesActions.REFUSE]: REFUSE_FILE,
});

function updateSubscription(playerUUID, name, value) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/subscription`,
        method: 'PUT',
        types: [
          UPDATE_SUBSCRIPTION.REQUEST,
          UPDATE_SUBSCRIPTION.SUCCESS,
          UPDATE_SUBSCRIPTION.FAILURE,
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
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

function uploadProfileFile(playerUUID, type, file) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/kyc/${playerUUID}/${type}/upload`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: buildFormData({ file }),
        types: [
          {
            type: UPLOAD_FILE.REQUEST,
            payload: { file },
          },
          UPLOAD_FILE.SUCCESS,
          UPLOAD_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchBalances(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/es/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_BALANCES.REQUEST,
          FETCH_BALANCES.SUCCESS,
          FETCH_BALANCES.FAILURE,
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
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
    })
      .then(() => dispatch(fetchProfile(playerUUID)));
  };
}

function changeStatus({ action, ...data }) {
  return (dispatch) => {
    if (action === actions.BLOCK) {
      return dispatch(blockProfile(data));
    } else if (action === actions.UNBLOCK) {
      return dispatch(unblockProfile(data));
    } else if (action === actions.SUSPEND) {
      return dispatch(suspendProfile(data));
    } else if (action === actions.RESUME) {
      return dispatch(unblockProfile(data));
    }

    throw new Error(`Unknown status change action "${action}".`);
  };
}

function successUpdateProfileReducer(state, action) {
  console.log(action.payload);
  return {
    ...state,
    data: {
      ...state.data,
      ...action.payload,
      fullName: [action.payload.firstName, action.payload.lastName].join(' ').trim(),
      //shortUUID: shortify(action.payload.playerUUID, action.payload.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : ''),
      balance: action.payload && action.payload.balance
        ? action.payload.balance
        : state.data.balance,
      currencyCode: action.payload && action.payload.balance
        ? action.payload.balance.currency
        : state.data.currencyCode,
      signInIps: action.payload.signInIps ? Object.values(action.payload.signInIps).sort((a, b) => {
        if (a.sessionStart > b.sessionStart) {
          return -1;
        } else if (b.sessionStart > a.sessionStart) {
          return 1;
        }

        return 0;
      }) : state.data.signInIps,
    },
    isLoading: false,
    receivedAt: timestamp(),
  };
}

function successUpdateFileStatusReducer(state, action) {
  let field;
  if (action.payload.category === filesCategories.KYC_PERSONAL) {
    field = 'personalKycMetaData';
  } else if (action.payload.category === filesCategories.KYC_ADDRESS) {
    field = 'addressKycMetaData';
  }

  if (!field) {
    return state;
  }

  const index = state.data[field].findIndex(file => file.uuid === action.payload.uuid);

  if (index === -1) {
    return state;
  }

  const newState = {
    ...state,
    data: {
      ...state.data,
      [field]: [
        ...state.data[field],
      ],
    },
  };
  newState.data[field][index] = action.payload;

  return newState;
}

function successUploadFilesReducer(state, action) {
  const profileFiles = action.payload
    .filter(i => [filesCategories.KYC_PERSONAL, filesCategories.KYC_ADDRESS].indexOf(i.category) > -1);

  if (!profileFiles.length) {
    return state;
  }

  const newState = {
    ...state,
  };

  profileFiles.forEach((file) => {
    if (file.category === filesCategories.KYC_PERSONAL) {
      newState.data.personalKycMetaData = [
        ...newState.data.personalKycMetaData,
        file,
      ];
    } else if (file.category === filesCategories.KYC_PERSONAL) {
      newState.data.personalKycMetaData = [
        ...newState.data.personalKycMetaData,
        file,
      ];
    }
  });

  return newState;
}

function successDeleteFileReducer(state, action) {
  if (!action.meta && !action.meta.uuid) {
    return state;
  }

  const fields = ['personalKycMetaData', 'addressKycMetaData'];
  let index;
  for (const field of fields) {
    index = state.data[field].findIndex(file => file.uuid === action.meta.uuid);

    if (index !== -1) {
      const newState = {
        ...state,
        data: {
          ...state.data,
          [field]: [
            ...state.data[field],
          ],
        },
      };
      newState.data[field].splice(index, 1);

      return newState;
    }
  }

  return state;
}

const actionHandlers = {
  [FETCH_PROFILE.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [UPDATE_PROFILE.SUCCESS]: successUpdateProfileReducer,
  [FETCH_PROFILE.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
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
  [UPDATE_IDENTIFIER.SUCCESS]: successUpdateProfileReducer,
  [VERIFY_DATA.SUCCESS]: successUpdateProfileReducer,
  [REFUSE_DATA.SUCCESS]: successUpdateProfileReducer,
  [VERIFY_FILE.SUCCESS]: successUpdateFileStatusReducer,
  [REFUSE_FILE.SUCCESS]: successUpdateFileStatusReducer,
  [userProfileFilesActionTypes.VERIFY_FILE.SUCCESS]: successUpdateFileStatusReducer,
  [userProfileFilesActionTypes.REFUSE_FILE.SUCCESS]: successUpdateFileStatusReducer,
  [userProfileFilesActionTypes.DELETE_FILE.SUCCESS]: successDeleteFileReducer,
  [userProfileFilesActionTypes.SAVE_FILES.SUCCESS]: successUploadFilesReducer,
};

const actionTypes = {
  FETCH_PROFILE,
  ADD_TAG,
  DELETE_TAG,
  UPDATE_PROFILE,
  SUBMIT_KYC,
  FETCH_BALANCES,
  VERIFY_DATA,
  REFUSE_DATA,
  VERIFY_FILE,
  REFUSE_FILE,
  VERIFY_PROFILE_PHONE,
  VERIFY_PROFILE_EMAIL,
};
const actionCreators = {
  fetchProfile,
  submitData,
  verifyData,
  refuseData,
  uploadProfileFile,
  changeFileStatusByAction,
  updateProfile,
  updateIdentifier,
  resetPassword,
  activateProfile,
  updateSubscription,
  fetchBalances,
  changeStatus,
  addTag,
  deleteTag,
  verifyPhone,
  verifyEmail,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
