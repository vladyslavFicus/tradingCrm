import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';
import { actionCreators as usersActionCreators } from 'redux/modules/users';
import buildQueryString from 'utils/buildQueryString';

const KEY = 'users';
const FETCH_DORMANT_UUIDS = createRequestAction(`${KEY}/fetch-dormant-uuids`);
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);
const fetchUserEntities = usersActionCreators.fetchEntities(FETCH_ENTITIES);

function fetchDormantUsers(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/dormants?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_DORMANT_UUIDS.REQUEST,
            meta: { filters },
          },
          FETCH_DORMANT_UUIDS.SUCCESS,
          FETCH_DORMANT_UUIDS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchEntities(filters = {}) {
  return dispatch => dispatch(fetchDormantUsers(filters))
    .then((action) => {
      const response = action.payload;

      return response.content ? dispatch(fetchUserEntities({ playerUuidList: response.content }))
          .then(action => ({
            ...action,
            payload: {
              ...response.payload,
              content: action.payload.content,
            },
          })) : action;
    });
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: { ...action.meta.filters },
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
  filters: {},
  isLoading: false,
  error: null,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  FETCH_ENTITIES,
};

const actionCreators = {
  fetchEntities,
};

export { actionCreators, actionTypes, initialState };

export default reducer;
