import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../constants/note';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as filesSourceActionCreators } from '../../../../../redux/modules/files';
import { actions as filesActions } from '../../../../../constants/files';
import { accountStatuses as paymentAccountStatuses } from '../../../../../constants/payment';

const KEY = 'user-payment-accounts';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const FETCH_FILES_NOTES = createRequestAction(`${KEY}/fetch-files-notes`);
const FETCH_PAYMENT_ACCOUNT_FILES = createRequestAction(`${KEY}/fetch-payment-account-files`);

const VERIFY_FILE = createRequestAction(`${KEY}/verify-payment-account-file`);
const REFUSE_FILE = createRequestAction(`${KEY}/refuse-payment-account-file`);

const ACTIVE_PAYMENT_ACCOUNT = createRequestAction(`${KEY}/active-payment-account`);
const LOCK_PAYMENT_ACCOUNT = createRequestAction(`${KEY}/lock-payment-account`);

const fetchNotesFn = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const fetchFilesNotes = noteSourceActionCreators.fetchNotesByType(FETCH_FILES_NOTES);
const fetchPaymentAccountsFn = paymentSourceActionCreators.fetchPaymentAccounts(FETCH_ENTITIES);

const changeFileStatusByAction = filesSourceActionCreators.changeStatusByAction({
  [filesActions.VERIFY]: VERIFY_FILE,
  [filesActions.REFUSE]: REFUSE_FILE,
});

const mapPaymentAccounts = accounts =>
  accounts.reduce((result, entity) => ({
    ...result,
    [entity.uuid]: { ...entity, files: [] },
  }), {});

const mapNotesToEntities = (entities, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return entities;
  }

  return Object.keys(entities).reduce((result, UUID) => ({
    ...result,
    [UUID]: {
      ...entities[UUID],
      note: notes[UUID] ? notes[UUID][0] : null,
    },
  }), {});
};

const mapNotesToFiles = (paymentAccounts, fileNotes) => {
  if (!fileNotes || Object.keys(fileNotes).length === 0) {
    return paymentAccounts;
  }

  return Object.keys(paymentAccounts).reduce((result, UUID) => ({
    ...result,
    [UUID]: {
      ...paymentAccounts[UUID],
      files: mapNotesToEntities(paymentAccounts[UUID].files, fileNotes),
    },
  }), {});
};

const mapFilesToPaymentAccounts = (paymentAccounts, files) => {
  if (!files || Object.keys(files).length === 0) {
    return paymentAccounts;
  }

  return Object.keys(paymentAccounts).reduce((result, UUID) => ({
    ...result,
    [UUID]: {
      ...paymentAccounts[UUID],
      files: files[UUID] ? files[UUID] : null,
    },
  }), {});
};

function fetchFiles(playerUUID, targetUUIDs) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/files/${playerUUID}/target?${buildQueryString({ uuids: targetUUIDs })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_PAYMENT_ACCOUNT_FILES.REQUEST,
          FETCH_PAYMENT_ACCOUNT_FILES.SUCCESS,
          FETCH_PAYMENT_ACCOUNT_FILES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchFilesAndNotes(playerUUID, targetUUIDs) {
  return async (dispatch) => {
    const action = await dispatch(fetchFiles(playerUUID, targetUUIDs));

    if (action && !action.error) {
      let filesUUIDs = [];
      Object.keys(action.payload).forEach((key) => {
        filesUUIDs = [
          ...filesUUIDs,
          ...Object.keys(action.payload[key]),
        ];
      });

      await dispatch(fetchFilesNotes(targetTypes.FILE, filesUUIDs));
    }

    return action;
  };
}

function fetchEntities(playerUUID, fetchNotes = fetchNotesFn, fetchPaymentAccounts = fetchPaymentAccountsFn) {
  return async (dispatch) => {
    const action = await dispatch(fetchPaymentAccounts(playerUUID));

    if (action && action.type === FETCH_ENTITIES.SUCCESS && action.payload.length) {
      const targetUUIDs = action.payload.map(item => item.uuid);
      await dispatch(fetchNotes(targetTypes.PAYMENT_ACCOUNT, targetUUIDs));
      await dispatch(fetchFilesAndNotes(playerUUID, targetUUIDs));
    }

    return action;
  };
}

function updateFileStatusReducer(state, action) {
  const targetUUID = action.payload.targetUuid;
  const fileUUID = action.payload.uuid;
  return {
    ...state,
    items: {
      ...state.items,
      [targetUUID]: {
        ...state.items[targetUUID],
        files: {
          ...state.items[targetUUID].files,
          [fileUUID]: action.payload,
        },
      },
    },
  };
}

function activePaymentAccount(paymentAccountUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/accounts/${paymentAccountUUID}/unlock`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          ACTIVE_PAYMENT_ACCOUNT.REQUEST,
          ACTIVE_PAYMENT_ACCOUNT.SUCCESS,
          ACTIVE_PAYMENT_ACCOUNT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function lockPaymentAccount(paymentAccountUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/payment/accounts/${paymentAccountUUID}/lock`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          LOCK_PAYMENT_ACCOUNT.REQUEST,
          LOCK_PAYMENT_ACCOUNT.SUCCESS,
          LOCK_PAYMENT_ACCOUNT.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function changePaymentAccountStatus(action, paymentAccountUUID) {
  return (dispatch) => {
    if (action === paymentAccountStatuses.ACTIVE) {
      return dispatch(activePaymentAccount(paymentAccountUUID));
    } else if (action === paymentAccountStatuses.LOCKED) {
      return dispatch(lockPaymentAccount(paymentAccountUUID));
    }

    throw new Error(`Unknown status change action "${action}".`);
  };
}

function updatePaymentAccountStatusReducer(state, action) {
  const paymentAccountUUID = action.payload.uuid;

  const newState = {
    ...state,
    items: {
      ...state.items,
    },
  };

  newState.items[paymentAccountUUID] = { ...newState.items[paymentAccountUUID], ...action.payload };

  return newState;
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    items: mapPaymentAccounts(action.payload),
    isLoading: false,
    receivedAt: timestamp(),
    noResults: action.payload.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    items: mapNotesToEntities(state.items, action.payload),
  }),
  [FETCH_FILES_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    items: mapNotesToFiles(state.items, action.payload),
  }),
  [FETCH_PAYMENT_ACCOUNT_FILES.SUCCESS]: (state, action) => ({
    ...state,
    items: mapFilesToPaymentAccounts(state.items, action.payload),
  }),
  [VERIFY_FILE.SUCCESS]: updateFileStatusReducer,
  [REFUSE_FILE.SUCCESS]: updateFileStatusReducer,
  [ACTIVE_PAYMENT_ACCOUNT.SUCCESS]: updatePaymentAccountStatusReducer,
  [LOCK_PAYMENT_ACCOUNT.SUCCESS]: updatePaymentAccountStatusReducer,
};
const initialState = {
  items: {},
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchEntities,
  fetchFilesAndNotes,
  changeFileStatusByAction,
  changePaymentAccountStatus,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
