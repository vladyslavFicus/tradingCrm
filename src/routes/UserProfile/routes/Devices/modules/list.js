import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';

const KEY = 'user/devices';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-devices`);

function fetchEntities(playerUUID, filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${playerUUID}/devices?${buildQueryString(filters)}`,
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
  };
}

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
    content: [{
      deviceUUID: '454a636d-4893-4f3c-bf23-0f6e78184d74',
      type: 'MOBILE',
      operatingSystem: 'Windows 10',
      lastIp: 'ua',
      lastLogin: '2017-05-23T12:11:32.408',
      totalLogin: 1,
    }, {
      deviceUUID: '454a636d-4893-4f3c-bf23-0f6e78184d74',
      type: 'MOBILE',
      operatingSystem: 'iOS',
      lastIp: 'pl',
      lastLogin: '2017-05-23T12:11:32.408',
      totalLogin: 18,
    }, {
      deviceUUID: '454a636d-4893-4f3c-bf23-0f6e78184d74',
      type: 'DESKTOP',
      operatingSystem: 'Android 7.0.1',
      lastIp: 'pl',
      lastLogin: '2017-05-23T12:11:32.408',
      totalLogin: 4,
    }],
  },
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
};
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
