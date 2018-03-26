import { CALL_API } from 'redux-api-middleware';
import buildQueryString from '../../../../utils/buildQueryString';

function fetchFullFreeSpinTemplates(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin_template/templates/igromat?${buildQueryString(filters)}`,
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

function fetchShortFreeSpinTemplates(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin_template/templates/igromat/short?${buildQueryString(filters)}`,
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

function fetchFreeSpinTemplates(type) {
  return (filters, short = false) => dispatch => short
    ? dispatch(fetchShortFreeSpinTemplates(type)(filters))
    : dispatch(fetchFullFreeSpinTemplates(type)(filters));
}

function fetchFreeSpinTemplate(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin_template/templates/igromat/${uuid}`,
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

function createFreeSpinTemplate(type) {
  return data => (dispatch, getState) => {
    const { aggregatorId } = data;
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin_template/templates/${aggregatorId}`,
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

function assignFreeSpinTemplate(type) {
  return (uuid, data) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin_template/templates/igromat/${uuid}/assign`,
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
  fetchFreeSpinTemplates,
  fetchFreeSpinTemplate,
  createFreeSpinTemplate,
  assignFreeSpinTemplate,
};

export {
  sourceActionCreators,
};
