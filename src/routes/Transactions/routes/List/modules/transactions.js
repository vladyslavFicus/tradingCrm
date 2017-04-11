import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../redux/modules/note';
import { actionCreators as usersActionCreators } from '../../../../../redux/modules/users';
import { targetTypes } from '../../../../../constants/note';

const KEY = 'transactions/transactions';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const FETCH_PROFILES = createRequestAction(`${KEY}/fetch-profiles`);

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
      await dispatch(fetchProfiles({ playerUuidList }));
      await dispatch(fetchNotes(targetTypes.PAYMENT, action.payload.content.map(item => item.paymentId)));
    }

    return action;
  };
}

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
      content: [
        ...mapNotesToTransactions(state.entities.content, action.payload),
      ],
    },
  }),
  [FETCH_PROFILES.SUCCESS]: (state, action) => {
    const newState = {
      ...state,
      profiles: {
        ...state.profiles,
        ...action.payload.content.reduce((res, profile) => ({ ...res, [profile.uuid]: profile }, res), {}),
      },
    };

    newState.entities = mapProfilesToTransactions(newState.entities.content, newState.profiles);

    return newState;
  },
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
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
