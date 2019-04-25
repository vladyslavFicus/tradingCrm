import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import moment from 'moment';
import { getDialCodeByDigits } from 'bc-countries';
import buildQueryString from '../../../utils/buildQueryString';
import { statuses as kycStatuses } from '../../../constants/kyc';

const emptyBalance = {
  amount: 0,
  currency: 'EUR',
};
const fetchProfileMapResponse = (response) => {
  const {
    email,
    phone,
    phoneNumber,
    phoneCode,
    firstName,
    weight,
    lastName,
    birthDate,
    kycPersonalStatus,
    kycAddressStatus,
    totalBalance,
    bonusBalance,
    withdrawableAmount,
    realMoneyBalance,
    signInIps,
  } = response;

  const contactData = { email, phone, phoneNumber, phoneCode };

  if (!phoneCode && phoneNumber) {
    const parsedPhoneCode = getDialCodeByDigits(phoneNumber);

    if (parsedPhoneCode) {
      contactData.phoneCode = parsedPhoneCode;
      contactData.phone = contactData.phoneNumber.substring(parsedPhoneCode.length);
    } else {
      contactData.phone = contactData.phoneNumber;
    }
  }

  const kycCompleted = kycPersonalStatus && kycAddressStatus
    && kycPersonalStatus.status === kycStatuses.VERIFIED && kycAddressStatus.status === kycStatuses.VERIFIED;
  let kycDate = null;

  if (kycPersonalStatus && kycAddressStatus) {
    kycDate = (
      kycPersonalStatus.statusDate > kycAddressStatus.statusDate
        ? kycPersonalStatus.statusDate
        : kycAddressStatus.statusDate
    );
  }

  const payload = {
    ...response,
    ...contactData,
    fullName: [firstName, lastName].filter(item => item).join(' '),
    weight: weight || 0,
    age: birthDate && moment(birthDate).isValid() ? moment().diff(birthDate, 'years') : null,
    birthDate: birthDate && moment(birthDate).isValid() ? moment(birthDate).format('YYYY-MM-DD') : null,
    kycDate,
    kycCompleted,
    balance: totalBalance || emptyBalance,
    signInIps: signInIps ? Object.values(signInIps).sort((a, b) => {
      if (a.sessionStart > b.sessionStart) {
        return -1;
      } else if (b.sessionStart > a.sessionStart) {
        return 1;
      }

      return 0;
    }) : [],
  };
  payload.currencyCode = payload.balance && payload.balance.currency ? payload.balance.currency : null;
  payload.balances = {
    total: totalBalance || { ...emptyBalance },
    bonus: bonusBalance || {
      ...emptyBalance,
      currency: payload.balance ? payload.balance.currency : emptyBalance.currency,
    },
    real: realMoneyBalance || {
      ...emptyBalance,
      currency: payload.balance ? payload.balance.currency : emptyBalance.currency,
    },
    withdrawable: withdrawableAmount || {
      ...emptyBalance,
      currency: payload.balance ? payload.balance.currency : emptyBalance.currency,
    },
  };

  return payload;
};

function fetchProfile(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: [
          type.REQUEST,
          {
            type: type.SUCCESS,
            payload: (__, ___, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => fetchProfileMapResponse(json));
              }
            },
          },
          {
            type: type.FAILURE,
            meta: { uuid },
            payload: (__, ___, response) => response,
          },
        ],
        bailout: !logged,
      },
    });
  };
}

function profileActivateRequest(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `profile/profiles/${uuid}/send-activation-link`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
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
    const { auth: { logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/profile/profiles/${uuid}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
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
    const { auth: { logged } } = getState();
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
    const { auth: { logged } } = getState();
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
  profileActivateRequest,
};

export {
  actionTypes,
  actionCreators,
};
