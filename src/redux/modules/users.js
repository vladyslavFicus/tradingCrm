import { CALL_API } from 'redux-api-middleware';
import buildQueryString from 'utils/buildQueryString';

function fetchProfile(type) {
  return (uuid) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function fetchEntities(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();
    let method = 'GET';
    let playerUuidList = filters.playerUuidList;
    filters = Object.keys(filters).reduce((result, key) => {
      if (filters[key]) {
        result[key] = filters[key];
      }

      return result;
    }, {});

    if (playerUuidList) {
      method = 'POST';
      delete filters.playerUuidList;
    }

    const endpointParams = { page: 0, ...filters };
    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles?${buildQueryString(endpointParams)}`,
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: playerUuidList ? JSON.stringify({ playerUuidList }) : undefined,
        types: [
          {
            type: type.REQUEST,
            meta: {
              filters,
            },
          },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {};
const actionHandlers = {};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {};
const actionCreators = {
  fetchProfile,
  fetchEntities,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
