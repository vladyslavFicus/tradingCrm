import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'bonusCampaigns/wagering-fulfilments';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const CREATE_ENTITIES = createRequestAction(`${KEY}/create-entities`);
const DELETE_ENTITIES = createRequestAction(`${KEY}/delete-entities`);

function fetchEntities() {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'wagering_fulfillment/wagering-fulfillment',
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

function createEntity(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'wagering_fulfillment/wagering-fulfillment',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CREATE_ENTITIES.REQUEST,
          CREATE_ENTITIES.SUCCESS,
          CREATE_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function deleteEntity(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `wagering_fulfillment/wagering-fulfillment/${uuid}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          DELETE_ENTITIES.REQUEST,
          DELETE_ENTITIES.SUCCESS,
          DELETE_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  entities: [],
  error: null,
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: payload,
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};

const actionTypes = {
  FETCH_ENTITIES,
  CREATE_ENTITIES,
  DELETE_ENTITIES,
};
const actionCreators = {
  fetchEntities,
  createEntity,
  deleteEntity,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);