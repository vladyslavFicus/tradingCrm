import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import moment from 'moment';
import { getDialCodeByDigits } from 'bc-countries';
import config, { getBrand } from '../../config';
import buildQueryString from '../../utils/buildQueryString';
import { statuses as kycStatuses } from '../../constants/kyc';

const emptyBalance = {
  amount: 0,
  currency: config.nas.brand.currencies.base,
};
const fetchProfileMapResponse = (response) => {
  const {
    email,
    phone,
    phoneNumber,
    phoneCode,
    firstName,
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
            payload: (payload, state, response) => response,
          },
        ],
        bailout: !logged,
      },
    });
  };
}

function passwordResetRequest(type) {
  return (uuid, sendEmail = true) => (dispatch, getState) => {
    const { auth: { token, logged, brandId } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/password/${brandId}/${uuid}/reset/request${sendEmail ? '' : '?send-mail=false'}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

function passwordResetConfirm(type) {
  return ({ password, repeatPassword, token }) => dispatch => dispatch({
    [CALL_API]: {
      endpoint: 'auth/password/reset',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, repeatPassword, token }),
      types: [
        type.REQUEST,
        type.SUCCESS,
        type.FAILURE,
      ],
    },
  });
}

function fetchResetPasswordToken(type) {
  return playerUUID => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `auth/password/reset-token?playerUUID=${playerUUID}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/html',
        },
        types: [
          type.REQUEST,
          { type: type.SUCCESS, payload: (action, state, res) => res.text() },
          type.FAILURE,
        ],
        bailout: !logged || !token,
      },
    });
  };
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
  passwordResetConfirm,
  profileActivateRequest,
  fetchResetPasswordToken,
};

export {
  actionTypes,
  actionCreators,
};
