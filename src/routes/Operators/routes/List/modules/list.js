import { CALL_API } from 'redux-api-middleware';
import timestamp from 'utils/timestamp';
import createRequestAction from 'utils/createRequestAction';
const KEY = 'operators';
const CREATE_OPERATOR = createRequestAction(`${KEY}/create-operator`);
const FETCH_ENTITIES = createRequestAction(`${KEY}/entities`);

function createOperator(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CREATE_OPERATOR.REQUEST,
          CREATE_OPERATOR.SUCCESS,
          CREATE_OPERATOR.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
};

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `operator/operators`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_ENTITIES.REQUEST,
          FETCH_ENTITIES.SUCCESS,
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
    filters: { ...action.meta.filters },
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
    content: [{
      operatorId: 'af2f614a-bc85-4bea-b910-20124e1acee7',
      firstName: 'Jimmy',
      lastName: 'Black',
      country: 'United Kingdom',
      registered: '2017-02-02T12:12:12',
      status: 'INACTIVE',
      statusChanged: '2017-02-02T11:11:11',
    }, {
      operatorId: 'af2f614a-bc85-4bea-b910-20124e1acee7',
      firstName: 'Jimmy',
      lastName: 'Black',
      country: 'Denmark',
      registered: '2017-02-02T12:12:12',
      status: 'ACTIVE',
      statusChanged: '2017-02-02T11:11:11',
    }, {
      operatorId: 'af2f614a-bc85-4bea-b910-20124e1acee7',
      firstName: 'Britney',
      lastName: 'Pregualman',
      country: 'Germany',
      registered: '2017-02-02T12:12:12',
      status: 'CLOSED',
      statusChanged: '2017-02-02T11:11:11',
    }],
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
  createOperator,
};

export { actionCreators, actionTypes, initialState };

export default reducer;
