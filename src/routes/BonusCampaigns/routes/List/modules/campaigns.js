import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import moment from 'moment';
import { statuses, statusesReasons } from '../../../../../constants/bonus-campaigns';
import { getApiRoot } from '../../../../../config';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import timestamp from '../../../../../utils/timestamp';
import buildQueryString from '../../../../../utils/buildQueryString';
import downloadBlob from '../../../../../utils/downloadBlob';

const KEY = 'bonusCampaigns/campaigns';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const CREATE_CAMPAIGN = createRequestAction(`${KEY}/create-campaign`);
const EXPORT_ENTITIES = createRequestAction(`${KEY}/export-entities`);
const CHANGE_CAMPAIGN_STATE = createRequestAction(`${KEY}/change-campaign-state`);
const RESET_CAMPAIGNS = `${KEY}/reset`;

const mergeEntities = (stored, fetched) => {
  const merged = [...stored];

  fetched.forEach((item) => {
    if (merged.findIndex(i => i.uuid === item.uuid) === -1) {
      merged.push(item);
    }
  });

  return merged;
};

function fetchEntities(filters = {}) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const queryParams = { page: 0, orderByPriority: true, ...filters };

    if (queryParams.state) {
      if (queryParams.state === statuses.CANCELED) {
        queryParams.state = statuses.FINISHED;
        queryParams.stateReason = statusesReasons.CANCELED;
      }
    }

    const queryString = buildQueryString(
      _.omitBy(queryParams, val => !val),
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

function createCampaign(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const endpointParams = { ...data, optIn: data.optIn || false };
    if (endpointParams.conversionPrize && endpointParams.conversionPrize.value === undefined) {
      endpointParams.conversionPrize = null;
    }
    if (endpointParams.capping && endpointParams.capping.value === undefined) {
      endpointParams.capping = null;
    }

    return dispatch({
      [CALL_API]: {
        endpoint: 'promotion/campaigns',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(endpointParams),
        types: [
          CREATE_CAMPAIGN.REQUEST,
          CREATE_CAMPAIGN.SUCCESS,
          CREATE_CAMPAIGN.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function exportEntities(filters = {}) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!logged) {
      return dispatch({ type: EXPORT_ENTITIES.FAILED });
    }

    const queryParams = { orderByPriority: true, ...filters, page: undefined };

    if (queryParams.state) {
      if (queryParams.state === statuses.CANCELED) {
        queryParams.state = statuses.FINISHED;
        queryParams.stateReason = statusesReasons.CANCELED;
      }
    }

    const queryString = buildQueryString(
      _.omitBy(queryParams, val => !val),
    );

    const response = await fetch(`${getApiRoot()}/promotion/campaigns?${queryString}`, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const blobData = await response.blob();
    downloadBlob(`bonus-campaigns-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`, blobData);

    return dispatch({ type: EXPORT_ENTITIES.SUCCESS });
  };
}


function changeCampaignState(state, id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${id}/${state}`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CHANGE_CAMPAIGN_STATE.REQUEST,
          CHANGE_CAMPAIGN_STATE.SUCCESS,
          CHANGE_CAMPAIGN_STATE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function resetCampaigns() {
  return {
    type: RESET_CAMPAIGNS,
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
    content: [],
  },
  error: null,
  filters: {},
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: (state, action) => ({
    ...state,
    filters: action.meta.filters,
    isLoading: true,
    error: null,
    noResults: false,
  }),
  [FETCH_ENTITIES.SUCCESS]: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload,
      content: action.payload.number === 0
        ? action.payload.content
        : mergeEntities(state.entities.content, action.payload.content),
    },
    isLoading: false,
    receivedAt: timestamp(),
    noResults: !action.payload.content.length,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
    noResults: false,
  }),
  [RESET_CAMPAIGNS]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  EXPORT_ENTITIES,
  CHANGE_CAMPAIGN_STATE,
  RESET_CAMPAIGNS,
};
const actionCreators = {
  fetchEntities,
  createCampaign,
  exportEntities,
  changeCampaignState,
  resetCampaigns,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
