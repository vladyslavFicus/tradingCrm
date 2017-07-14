import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import timestamp from '../../../../../../../utils/timestamp';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../redux/modules/note';
import { targetTypes } from '../../../../../../../constants/note';
import { types as bonusTypes } from '../../../../../../../constants/bonus';

const KEY = 'user/bonuses/list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);
const CREATE_BONUS = createRequestAction(`${KEY}/create`);

const fetchNotes = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const mapEntities = async (dispatch, pageable) => {
  const uuids = pageable.content.map(item => item.bonusUUID);

  if (!uuids.length) {
    return pageable;
  }

  const newPageable = { ...pageable };
  newPageable.content = newPageable.content.map(item => ({
    ...item,
    wagered: item.wagered === null
      ? { amount: 0, currency: item.currency }
      : item.wagered,
    toWager: {
      amount: Math.max(
        item.amountToWage && !isNaN(item.amountToWage.amount) &&
        item.wagered && !isNaN(item.wagered.amount)
          ? item.amountToWage.amount - item.wagered.amount : 0,
        0,
      ),
      currency: item.currency,
    },
  }));

  const action = await dispatch(fetchNotes(targetTypes.BONUS, uuids));
  if (!action || action.error) {
    return newPageable;
  }

  return new Promise((resolve) => {
    newPageable.content = newPageable.content.map(item => ({
      ...item,
      note: action.payload[item.bonusUUID] && action.payload[item.bonusUUID].length
        ? action.payload[item.bonusUUID][0]
        : null,
    }));

    return resolve(newPageable);
  });
};

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!filters.playerUUID) {
      throw new Error('playerUUID not defined');
    }

    const queryParams = { ...filters, sortColumn: 'createdDate', sortDirection: 'DESC' };
    delete queryParams.playerUUID;

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${filters.playerUUID}?${buildQueryString(queryParams)}`,
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
          {
            type: FETCH_ENTITIES.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');

              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => mapEntities(dispatch, json));
              }
            },
          },
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function createBonus(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'bonus/bonuses',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, bonusType: bonusTypes.Manual, optIn: data.optIn || false }),
        types: [
          CREATE_BONUS.REQUEST,
          CREATE_BONUS.SUCCESS,
          CREATE_BONUS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.filters },
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
        : [
          ...state.entities.content,
          ...action.payload.content,
        ],
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
};
const initialState = {
  entities: {
    first: null,
    last: null,
    number: null,
    numberOfElements: null,
    size: null,
    sort: null,
    totalElements: null,
    totalPages: null,
    content: [],
  },
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_NOTES,
};
const actionCreators = {
  fetchEntities,
  fetchNotes,
  createBonus,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
