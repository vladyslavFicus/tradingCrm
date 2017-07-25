import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../utils/buildQueryString';

const KEY = 'kyc-requests';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const RESET = `${KEY}/reset`;

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `hz/hz/hz?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: FETCH_ENTITIES.REQUEST,
            meta: { ...filters },
          },
          FETCH_ENTITIES.SUCCESS,
          FETCH_ENTITIES.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function reset() {
  return {
    type: RESET,
  };
}

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
      birthDate: '1992-02-21T15:03:49.702',
      firstName: 'firstName',
      lastName: 'lastName',
      username: 'username',
      languageCode: 'en',
      kycAddressStatus: {
        author: 'OPERATOR-576sadf',
        status: 'VERIFIED',
        statusDate: '2017-02-21T15:03:49.702',
      },
      kycPersonalStatus: {
        author: 'OPERATOR-576sadf',
        status: 'PENDING',
        statusDate: '2017-02-21T15:03:49.702',
      },
      kycRequest: {
        requestDate: '2017-02-21T15:03:49.702',
        authorUUID: 'PLAYER-576sadf',
      },
      playerUUID: '123234',
    }, {
      birthDate: '1992-02-21T15:03:49.702',
      firstName: 'asdfasd',
      lastName: 'sdfgsdf',
      username: 'sfgs',
      languageCode: 'en',
      kycAddressStatus: {
        author: 'OPERATOR-576sadf',
        status: 'DOCUMENTS_SENT',
        statusDate: '2017-02-21T15:03:49.702',
      },
      kycPersonalStatus: {
        author: 'OPERATOR-576sadf',
        status: 'PENDING',
        statusDate: '2017-02-21T15:03:49.702',
      },
      kycRequest: {
        requestDate: '2017-02-21T15:03:49.702',
        authorUUID: 'PLAYER-576sadf',
      },
      playerUUID: '797823',
    }],
  },
  filters: {},
  isLoading: false,
  error: null,
  receivedAt: null,
  exporting: false,
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
  [RESET]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  RESET,
};
const actionCreators = {
  fetchEntities,
  reset,
};

export {
  actionCreators,
  actionTypes,
  initialState,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
