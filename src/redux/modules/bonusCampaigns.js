import { CALL_API } from 'redux-api-middleware';
import { omitBy } from 'lodash';
import { statuses, statusesReasons } from '../../constants/bonus-campaigns';
import buildQueryString from '../../utils/buildQueryString';

function fetchCampaigns(type) {
  return (filters = {}) => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const queryParams = { page: 0, orderByPriority: true, ...filters };

    if (queryParams.state) {
      if (queryParams.state === statuses.CANCELED) {
        queryParams.state = statuses.FINISHED;
        queryParams.stateReason = statusesReasons.CANCELED;
      }
    }

    const queryString = buildQueryString(
      omitBy(queryParams, val => !val),
    );

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns?${queryString}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          {
            type: type.REQUEST,
            meta: { filters },
          },
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function fetchCampaign(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${uuid}`,
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

const sourceActionCreators = {
  fetchCampaigns,
  fetchCampaign,
};

export {
  sourceActionCreators,
};
