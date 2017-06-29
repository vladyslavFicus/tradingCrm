import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import timestamp from '../../../../../../../utils/timestamp';
import buildQueryString from '../../../../../../../utils/buildQueryString';
import { sourceActionCreators as noteSourceActionCreators } from '../../../../../../../redux/modules/note';
import { targetTypes } from '../../../../../../../constants/note';

const KEY = 'user/bonus-free-spin/list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotes = noteSourceActionCreators.fetchNotesByType(FETCH_NOTES);
const mapEntities = async (dispatch, pageable) => {
  const uuids = pageable.content.map(item => item.uuid);

  if (!uuids.length) {
    return pageable;
  }

  const newPageable = { ...pageable };

  newPageable.content = newPageable.content.map(item => ({
    ...item,
    spinValue: item.betPerLine * item.linesPerSpin,
    totalValue: item.betPerLine * item.linesPerSpin * item.freeSpinsAmount,
  }));

  const action = await dispatch(fetchNotes(targetTypes.FREE_SPIN, uuids));
  if (!action || action.error) {
    return newPageable;
  }

  return new Promise((resolve) => {
    newPageable.content = newPageable.content.map(item => ({
      ...item,
      note: action.payload[item.uuid] && action.payload[item.uuid].length
        ? action.payload[item.uuid][0]
        : null,
    }));

    return resolve(newPageable);
  });
};

function fetchFreeSpins(filters) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();
    if (!filters.playerUUID) {
      throw new Error('playerUUID not defined');
    }

    const queryString = buildQueryString({ ...filters, playerUUID: undefined });

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${filters.playerUUID}?${queryString}`,
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

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
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
  fetchFreeSpins,
  fetchNotes,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
