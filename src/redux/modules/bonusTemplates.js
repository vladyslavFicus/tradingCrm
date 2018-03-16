import { CALL_API } from 'redux-api-middleware';
import buildQueryString from '../../utils/buildQueryString';

function fetchFullBonusTemplates(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus_template/templates?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          { type: type.REQUEST, payload: filters },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchShortBonusTemplates(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus_template/templates/short?${buildQueryString(filters)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          { type: type.REQUEST, payload: filters },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchBonusTemplates(type) {
  return (filters, short = false) => dispatch => short
    ? dispatch(fetchShortBonusTemplates(type)(filters))
    : dispatch(fetchFullBonusTemplates(type)(filters));
}

function createBonusTemplate(type) {
  return data => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'bonus_template/templates',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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

function fetchBonusTemplate(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus_template/templates/${uuid}`,
        method: 'GET',
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

function assignBonusTemplate(type) {
  return (uuid, data) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus_template/templates/${uuid}/assign`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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

const sourceActionCreators = {
  fetchBonusTemplates,
  fetchBonusTemplate,
  createBonusTemplate,
  assignBonusTemplate,
};

export {
  sourceActionCreators,
};
