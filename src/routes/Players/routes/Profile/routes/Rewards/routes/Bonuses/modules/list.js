import { CALL_API } from 'redux-api-middleware';
import { get } from 'lodash';
import update from 'react-addons-update';
import createReducer from '../../../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../../../redux/modules/note';
import { actionTypes as bonusActionTypes } from './bonus';
import {
  cancellationReason,
  actions,
  mapActionToState,
} from '../../../../../../../../../constants/bonus';

const KEY = 'user/bonuses/list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotes = noteSourceActionCreators.fetchNotesByTargetUuids(FETCH_NOTES);
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

  const action = await dispatch(fetchNotes(uuids));
  if (!action || action.error) {
    return newPageable;
  }

  const notes = get(action, 'payload.content', []);

  return new Promise((resolve) => {
    newPageable.content = newPageable.content.map(item => ({
      ...item,
      note: notes.find(n => n.targetUUID === item.bonusUUID) || null,
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

const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.filters },
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? payload.content
        : [
          ...state.entities.content,
          ...payload.content,
        ],
    },
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.content.length === 0,
  }),
  [bonusActionTypes.CHANGE_BONUS_STATE.SUCCESS]: (
    state,
    {
      payload: {
        bonusUUID,
        action,
        operatorUUID,
      },
      meta: {
        endRequestTime,
      },
    }
  ) => {
    const index = state.entities.content.findIndex(i => i.bonusUUID === bonusUUID);

    return update(state, {
      entities: {
        content: {
          [index]: {
            state: {
              $set: mapActionToState[action],
            },
            cancellationReason: {
              $set: action === actions.CANCEL ? cancellationReason.MANUAL_BY_OPERATOR : null,
            },
            cancellerUUID: {
              $set: action === actions.CANCEL ? operatorUUID : null,
            },
          },
        },
      },
      receivedAt: {
        $set: endRequestTime,
      },
      isLoading: {
        $set: false,
      },
    });
  },

  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const actionTypes = {
  FETCH_ENTITIES,
  FETCH_NOTES,
};
const actionCreators = {
  fetchEntities,
  fetchNotes,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
