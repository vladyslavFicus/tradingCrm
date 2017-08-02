import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import moment from 'moment';
import buildQueryString from '../../utils/buildQueryString';
import { statuses as kycStatuses } from '../../constants/kyc';

const fetchProfileMapResponse = (response) => {
  const { birthDate, kycPersonalStatus, kycAddressStatus, balance, signInIps } = response;
  const kycCompleted = kycPersonalStatus && kycAddressStatus
    && kycPersonalStatus.status === kycStatuses.VERIFIED && kycAddressStatus.status === kycStatuses.VERIFIED;
  let kycDate = null;

  if (kycPersonalStatus && kycAddressStatus) {
    kycDate = kycPersonalStatus.statusDate > kycAddressStatus.statusDate
      ? kycPersonalStatus.statusDate
      : kycAddressStatus.statusDate;
  }

  return {
    ...response,
    fullName: [response.firstName, response.lastName].join(' '),
    age: moment().diff(birthDate, 'years'),
    birthDate: moment(birthDate).format('YYYY-MM-DD'),
    kycDate,
    kycCompleted,
    currencyCode: balance && balance.currency ? balance.currency : null,
    signInIps: signInIps ?
      Object.values(signInIps).sort((a, b) => {
        if (a.sessionStart > b.sessionStart) {
          return -1;
        } else if (b.sessionStart > a.sessionStart) {
          return 1;
        }

        return 0;
      }) : [],
  };
};

function fetchProfile(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/es/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          type.REQUEST,
          {
            type: type.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => fetchProfileMapResponse(json));
              }
            },
          },
          {
            type: type.FAILURE,
            meta: { uuid },
          },
        ],
        bailout: !logged,
      },
    });
  };
}

function passwordResetRequest(type) {
  return ({ email }) => dispatch => dispatch({
    [CALL_API]: {
      endpoint: 'auth/password/reset/request',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      types: [
        type.REQUEST,
        type.SUCCESS,
        type.FAILURE,
      ],
    },
  });
}

function profileActivateRequest(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${uuid}/send-activation-link`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
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

function fetchEntities(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();
    const queryString = buildQueryString(
      _.omitBy({ page: 0, ...filters }, (val, key) => !val || key === 'playerUuidList')
    );

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles?${queryString}`,
        method: filters.playerUuidList ? 'POST' : 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: filters.playerUuidList ? JSON.stringify({ playerUuidList: filters.playerUuidList }) : undefined,
        types: [
          {
            type: type.REQUEST,
            meta: {
              ...filters,
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
    const queryString = buildQueryString(
      _.omitBy({ page: 0, ...filters }, (val, key) => !val || key === 'playerUuidList')
    );

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/es?${queryString}`,
        method: filters.playerUuidList ? 'POST' : 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: filters.playerUuidList ? JSON.stringify({ playerUuidList: filters.playerUuidList }) : undefined,
        types: [
          {
            type: type.REQUEST,
            meta: { ...filters },
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
  passwordResetRequest,
  profileActivateRequest,
};

export {
  actionTypes,
  actionCreators,
};
