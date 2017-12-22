import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../utils/createRequestAction';
import createReducer from '../../../../../utils/createReducer';
import { getBrand } from '../../../../../config';

const KEY = 'operator/authorities';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const ADD_ENTITIES = createRequestAction(`${KEY}/update-entities`);
const DELETE_ENTITIES = createRequestAction(`${KEY}/delete-entities`);

function fetchAuthority(operatorUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${operatorUUID}/authorities`,
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

function addAuthority(operatorUUID, data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${operatorUUID}/authorities`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, brandId: getBrand() }),
        types: [
          ADD_ENTITIES.REQUEST,
          ADD_ENTITIES.SUCCESS,
          ADD_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchAuthority(operatorUUID)));
  };
}

function deleteAuthority(operatorUUID, department, role) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/credentials/${operatorUUID}/authorities`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          department,
          role,
          brandId: getBrand(),
        }),
        types: [
          DELETE_ENTITIES.REQUEST,
          DELETE_ENTITIES.SUCCESS,
          DELETE_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    })
      .then(() => dispatch(fetchAuthority(operatorUUID)));
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
};
const initialState = {
  data: [],
  error: null,
  isLoading: false,
  receivedAt: null,
};

const actionTypes = {
  FETCH_ENTITIES,
};

const actionCreators = {
  fetchAuthority,
  deleteAuthority,
  addAuthority,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
