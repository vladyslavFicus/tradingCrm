import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import qs from 'qs';
import { statuses, statusesReasons } from '../../../../../constants/bonus-campaigns';
import { getApiRoot } from '../../../../../config';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators } from '../../../../../redux/modules/campaigns';
import exportFile from '../../../../../utils/exportFile';

const KEY = 'bonusCampaigns/campaigns';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const CREATE_CAMPAIGN = createRequestAction(`${KEY}/create-campaign`);
const EXPORT_ENTITIES = createRequestAction(`${KEY}/export-entities`);
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

const fetchEntities = sourceActionCreators.fetchCampaigns(FETCH_ENTITIES);

function createCampaign(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    const endpointParams = { ...data, optIn: data.optIn || false, campaignType: 'BONUS' };
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
  const queryParams = { orderByPriority: true, ...filters };

  if (queryParams.state) {
    if (queryParams.state === statuses.CANCELED) {
      queryParams.state = statuses.FINISHED;
      queryParams.stateReason = statusesReasons.CANCELED;
    }
  }

  const queryString = qs.stringify(queryParams, { delimiter: '&' });
  const type = EXPORT_ENTITIES;
  const endPoint = `${getApiRoot()}/promotion/campaigns?${queryString}`;
  const fileName = `bonus-campaigns-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`;

  return exportFile(type, endPoint, fileName);
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
  [FETCH_ENTITIES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    entities: {
      ...state.entities,
      ...payload,
      content: payload.number === 0
        ? payload.content
        : mergeEntities(state.entities.content, payload.content),
    },
    isLoading: false,
    receivedAt: endRequestTime,
    noResults: payload.content.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    isLoading: false,
    error: payload,
    receivedAt: endRequestTime,
  }),
  [RESET_CAMPAIGNS]: () => ({ ...initialState }),
};
const actionTypes = {
  FETCH_ENTITIES,
  EXPORT_ENTITIES,
  RESET_CAMPAIGNS,
};
const actionCreators = {
  fetchEntities,
  createCampaign,
  exportEntities,
  resetCampaigns,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
