import createReducer from 'utils/createReducer';
import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
import timestamp from 'utils/timestamp';
import buildQueryString from 'utils/buildQueryString';
import { actionCreators as noteActionCreators } from 'redux/modules/note';
import { targetTypes } from 'constants/note';

const KEY = 'user/payments';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-payments`);
const FETCH_NOTES = createRequestAction(`${KEY}/fetch-notes`);

const fetchNotes = noteActionCreators.fetchNotesByType(FETCH_NOTES);
const mapEntities = (dispatch, pageable) => {
  const uuids = pageable.content.map(item => item.paymentId);

  if (!uuids.length) {
    return pageable;
  }

  return dispatch(fetchNotes(targetTypes.PAYMENT, uuids))
    .then(action => {
      if (!action || action.error) {
        return pageable;
      }

      return new Promise(resolve => {
        pageable.content = pageable.content.map(item => {
          item.note = action.payload[item.paymentId] && action.payload[item.paymentId].length
            ? action.payload[item.paymentId][0]
            : null;

          return item;
        });

        return resolve(pageable);
      });
    });
};

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
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
          {
            type: FETCH_ENTITIES.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then((json) => mapEntities(dispatch, json));
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
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      ...action.meta.filters,
    },
    isLoading: true,
    isFailed: false,
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
  filters: {},
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchEntities,
};

export {
  actionTypes,
  actionCreators,
};

export default createReducer(initialState, actionHandlers);
