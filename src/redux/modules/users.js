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

function updateProfile(type) {
  return (uuid, data) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function updateIdentifier(type) {
  return (uuid, identifier) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}/identifier`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier }),
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

function fetchESEntities(type) {
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
        endpoint: `profile/profiles/es?${buildQueryString(endpointParams)}`,
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

const actionTypes = {};
const actionCreators = {
  fetchProfile,
  fetchEntities,
  fetchESEntities,
  updateProfile,
  updateIdentifier,
};

export {
  actionTypes,
  actionCreators,
};
