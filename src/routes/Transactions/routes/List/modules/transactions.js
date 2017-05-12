import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { actionCreators as usersActionCreators } from '../../../../../redux/modules/users';
import { sourceActionCreators as paymentSourceActionCreators } from '../../../../../redux/modules/payment';
import { targetTypes } from '../../../../../constants/note';
import config from '../../../../../config';

const KEY = 'transactions/transactions';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_PAYMENT_STATUSES = createRequestAction(`${KEY}/fetch-payment-statuses`);
const CHANGE_PAYMENT_STATUS = createRequestAction(`${KEY}/change-payment-status`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const FETCH_PROFILES = createRequestAction(`${KEY}/fetch-profiles`);
const FETCH_PROFILE_REAL_BALANCE = createRequestAction(`${KEY}/fetch-profile-balance`);
const FETCH_PROFILE_BONUS_BALANCE = createRequestAction(`${KEY}/fetch-profile-bonus`);
const RESET_TRANSACTIONS = `${KEY}/reset`;

const fetchPaymentStatuses = paymentSourceActionCreators.fetchPaymentStatuses(FETCH_PAYMENT_STATUSES);
const changePaymentStatus = paymentSourceActionCreators.changePaymentStatus(CHANGE_PAYMENT_STATUS);

const mergeEntities = (stored, fetched) => {
  const merged = [...stored];

  fetched.forEach((item) => {
    if (merged.findIndex(i => i.paymentId === item.paymentId) === -1) {
      merged.push(item);
    }
  });

  return merged;
};

const fetchNotesFn = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const mapNotesToTransactions = (transactions, notes) => {
  if (!notes || Object.keys(notes).length === 0) {
    return transactions;
  }

  return transactions.map(t => ({
    ...t,
    note: notes[t.paymentId] ? notes[t.paymentId][0] : null,
  }));
};

const fetchProfilesFn = usersActionCreators.fetchEntities(FETCH_PROFILES);
const mapProfilesToTransactions = (transactions, profiles) => {
  if (!profiles || Object.keys(profiles).length === 0) {
    return transactions;
  }

  return transactions.map(t => ({
    ...t,
    profile: profiles[t.playerUUID] ? profiles[t.playerUUID] : null,
  }));
};

function fetchEntities(filters = {}, fetchNotes = fetchNotesFn, fetchProfiles = fetchProfilesFn) {
  return async (dispatch, getState) => {
    const { auth: { token, logged }, transactions } = getState();

    const action = await dispatch({
      [CALL_API]: {
        endpoint: `payment/payments?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_ENTITIES.REQUEST,
            meta: { filters },
          },
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });

    if (action && action.type === FETCH_ENTITIES.SUCCESS && action.payload.content.length) {
      const currentPlayerUuidList = Object.keys(transactions.transactions.profiles);
      const playerUuidList = action.payload.content
        .map(item => item.playerUUID)
        .filter((value, index, list) => list.indexOf(value) === index && currentPlayerUuidList.indexOf(value) === -1);
      await dispatch(fetchProfiles({ playerUuidList, limit: playerUuidList.length }));
      await dispatch(fetchNotes(targetTypes.PAYMENT, action.payload.content.map(item => item.paymentId)));
    }

    return action;
  };
}

const mapSuccessBonusPayload = playerUUID => async (action, state, res) => {
  const contentType = res.headers.get('Content-Type');
  if (contentType && ~contentType.indexOf('json')) {
    const response = await res.json();

    if (response.content.length) {
      return { playerUUID, balance: { ...response.content[0].balance } };
    }
  }

  return { playerUUID, balance: null };
};

function fetchBonus(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}?${buildQueryString({ states: 'IN_PROGRESS' })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_PROFILE_BONUS_BALANCE.REQUEST,
          {
            type: FETCH_PROFILE_BONUS_BALANCE.SUCCESS,
            payload: mapSuccessBonusPayload(playerUUID),
          },
          FETCH_PROFILE_BONUS_BALANCE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function resetTransactions() {
  return {
    type: RESET_TRANSACTIONS,
  };
}

const mapSuccessBalancePayload = playerUUID => async (action, state, res) => {
  const contentType = res.headers.get('Content-Type');
  if (contentType && ~contentType.indexOf('json')) {
    const response = await res.json();

    if (response.balances) {
      const [balance] = Object
        .keys(response.balances)
        .reduce((result, item) => (
          result.push({
            amount: Number(parseFloat(response.balances[item].replace(item, '')).toFixed(2)),
            currency: item,
          }),
            result
        ), []);

      return { playerUUID, balance };
    }
  }
  return { playerUUID, balance: null };
};
function fetchBalance(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/wallet/balances/${playerUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_PROFILE_REAL_BALANCE.REQUEST,
          {
            type: FETCH_PROFILE_REAL_BALANCE.SUCCESS,
            payload: mapSuccessBalancePayload(playerUUID),
          },
          FETCH_PROFILE_REAL_BALANCE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchBalances(playerUUID) {
  return async dispatch => await Promise.all([
    dispatch(fetchBalance(playerUUID)),
    dispatch(fetchBonus(playerUUID)),
  ]);
}

const mapBalancesToTransactions = (playerUUID, balanceField, value, transactions) => transactions.map((transaction) => {
  if (transaction.playerUUID !== playerUUID) {
    return transaction;
  }

  let accumulatedBalances = { ...transaction.profile.accumulatedBalances };
  if (balanceField === 'real') {
    accumulatedBalances = {
      ...accumulatedBalances,
      real: { ...value, amount: value.amount - accumulatedBalances.bonus.amount },
    };
  } else if (balanceField === 'bonus') {
    accumulatedBalances = {
      ...accumulatedBalances,
      bonus: value,
      real: {
        ...accumulatedBalances.real,
        amount: transaction.profile.balance.amount - value.amount,
      },
    };
  }

  return {
    ...transaction,
    profile: {
      ...transaction.profile,
      balance: balanceField === 'real' ? value : transaction.profile.balance,
      accumulatedBalances,
    },
  };
});

const createSuccessBalanceReducer = balanceField => (state, action) => {
  if (action.payload.balance === null) {
    return state;
  }

  const newState = {
    ...state,
    entities: {
      ...state.entities,
      content: mapBalancesToTransactions(
        action.payload.playerUUID,
        balanceField,
        action.payload.balance,
        [...state.entities.content]
      ),
    },
  };

  if (newState.profiles[action.payload.playerUUID]) {
    let accumulatedBalances = { ...newState.profiles[action.payload.playerUUID].accumulatedBalances };
    if (balanceField === 'real') {
      accumulatedBalances = {
        ...accumulatedBalances,
        real: { ...action.payload.balance, amount: action.payload.balance.amount - accumulatedBalances.bonus.amount },
      };
    } else if (balanceField === 'bonus') {
      accumulatedBalances = {
        ...accumulatedBalances,
        bonus: action.payload.balance,
        real: {
          ...accumulatedBalances.real,
          amount: newState.profiles[action.payload.playerUUID].balance.amount - action.payload.balance.amount,
        },
      };
    }
    newState.profiles = {
      ...newState.profiles,
      [action.payload.playerUUID]: {
        ...newState.profiles[action.payload.playerUUID],
        balance: balanceField === 'real'
          ? action.payload.balance
          : newState.profiles[action.payload.playerUUID].balance,
        accumulatedBalances,
      },
    };
  }

  return newState;
};

const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: [],
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  profiles: {},
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: action.meta.filters,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.number === 0
        ? action.payload.content
        : mergeEntities(state.entities.content, action.payload.content),
    },
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
  [FETCH_NOTES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      content: mapNotesToTransactions(state.entities.content, action.payload),
    },
  }),
  [FETCH_PROFILES.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      profiles: action.payload.content.reduce((res, profile) => ({
        ...res,
        [profile.uuid]: res[profile.uuid] ? res[profile.uuid] : {
          uuid: profile.uuid,
          firstName: profile.firstName,
          lastName: profile.lastName,
          kycCompleted: profile.kycCompleted,
          profileStatus: profile.profileStatus,
          profileStatusReason: profile.profileStatusReason,
          birthDate: profile.birthDate,
          username: profile.username,
          languageCode: profile.languageCode,
          suspendEndDate: profile.suspendEndDate,
          status: profile.status,
          age: moment().diff(profile.birthDate, 'years'),
          balance: { amount: 0, currency: config.nas.currencies.base },
          accumulatedBalances: {
            real: { amount: 0, currency: config.nas.currencies.base },
            bonus: { amount: 0, currency: config.nas.currencies.base },
          },
        },
      }), { ...state.profiles }),
    };

    newState.entities = {
      ...newState.entities,
      content: mapProfilesToTransactions(newState.entities.content, newState.profiles),
    };

    return newState;
  },
  [FETCH_PROFILE_BONUS_BALANCE.SUCCESS]: createSuccessBalanceReducer('bonus'),
  [FETCH_PROFILE_REAL_BALANCE.SUCCESS]: createSuccessBalanceReducer('real'),
  [RESET_TRANSACTIONS]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_PAYMENT_STATUSES,
  CHANGE_PAYMENT_STATUS,
  FETCH_PROFILES,
  FETCH_PROFILE_REAL_BALANCE,
  FETCH_PROFILE_BONUS_BALANCE,
  RESET_TRANSACTIONS,
};
const actionCreators = {
  fetchEntities,
  fetchBonus,
  fetchBalance,
  fetchBalances,
  fetchPaymentStatuses,
  changePaymentStatus,
  resetTransactions,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
