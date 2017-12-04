import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import timestamp from '../../../../../../../utils/timestamp';
import buildQueryString from '../../../../../../../utils/buildQueryString';

const KEY = 'player/bonus-campaign/list';
const FETCH_ENTITIES = createRequestAction(`${KEY}/fetch-entities`);
const FETCH_ACTIVE_CAMPAIGN_LIST = createRequestAction(`${KEY}/fetch-active-campaigns`);
const FETCH_AVAILABLE_CAMPAIGN_LIST = createRequestAction(`${KEY}/fetch-available-campaigns`);
const DECLINE_CAMPAIGN = createRequestAction(`${KEY}/decline-campaign`);

function fetchCampaignListCreator(campaignType, actionType) {
  return filters => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    if (!filters.playerUUID) {
      throw new Error('playerUUID not defined');
    }

    const queryParams = { ...filters, sort: 'startDate,desc' };
    delete queryParams.playerUUID;

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${filters.playerUUID}/${campaignType}?${buildQueryString(queryParams)}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          actionType.REQUEST,
          actionType.SUCCESS,
          actionType.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const fetchActiveCampaignList = fetchCampaignListCreator('active', FETCH_ACTIVE_CAMPAIGN_LIST);
const fetchAvailableCampaignList = fetchCampaignListCreator('available', FETCH_AVAILABLE_CAMPAIGN_LIST);

function fetchPlayerCampaigns(filters) {
  return async (dispatch) => {
    dispatch({ type: FETCH_ENTITIES.REQUEST });
    const activeCampaignsListAction = await dispatch(fetchActiveCampaignList(filters));
    const availableCampaignsListAction = await dispatch(fetchAvailableCampaignList(filters));

    if (activeCampaignsListAction && activeCampaignsListAction.error) {
      return dispatch({ type: FETCH_ENTITIES.FAILURE, error: true, payload: activeCampaignsListAction.payload });
    } else if (availableCampaignsListAction && availableCampaignsListAction.error) {
      return dispatch({ type: FETCH_ENTITIES.FAILURE, error: true, payload: availableCampaignsListAction.payload });
    }

    return dispatch({
      type: FETCH_ENTITIES.SUCCESS,
      payload: {
        first: availableCampaignsListAction.payload.first,
        last: activeCampaignsListAction.payload.last && availableCampaignsListAction.payload.last,
        number: Math.max(activeCampaignsListAction.payload.number, availableCampaignsListAction.payload.number),
        numberOfElements: (
          activeCampaignsListAction.payload.numberOfElements + availableCampaignsListAction.payload.numberOfElements
        ),
        size: (
          activeCampaignsListAction.payload.size + availableCampaignsListAction.payload.size
        ),
        sort: activeCampaignsListAction.payload.sort || availableCampaignsListAction.payload.sort,
        totalElements: (
          activeCampaignsListAction.payload.totalElements + availableCampaignsListAction.payload.totalElements
        ),
        totalPages: Math.max(
          activeCampaignsListAction.payload.totalPages,
          availableCampaignsListAction.payload.totalPages
        ),
        content: (
          [
            ...activeCampaignsListAction.payload.content,
            ...availableCampaignsListAction.payload.content,
          ].sort((a, b) => {
            if (a.startDate > b.startDate) {
              return -1;
            } else if (b.startDate > a.startDate) {
              return 1;
            }

            return 0;
          })
        ),
      },
    });
  };
}

function declineCampaign(id, playerUUID, returnToList = false) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();
    const optoutType = returnToList ? 'return_to_list' : 'ignore_campaign';

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${id}/optout/${playerUUID}?optoutType=${optoutType}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [DECLINE_CAMPAIGN.REQUEST, DECLINE_CAMPAIGN.SUCCESS, DECLINE_CAMPAIGN.FAILURE],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [FETCH_ENTITIES.REQUEST]: state => ({
    ...state,
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
        : [
          ...state.entities.content,
          ...action.payload.content,
        ],
    },
    isLoading: false,
    receivedAt: timestamp(),
    noResults: action.payload.content.length === 0,
  }),
  [FETCH_ENTITIES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    receivedAt: timestamp(),
  }),
};
const initialState = {
  entities: {
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
    content: [],
  },
  error: null,
  isLoading: false,
  receivedAt: null,
  noResults: false,
};
const actionTypes = {
  FETCH_ENTITIES,
};
const actionCreators = {
  fetchPlayerCampaigns,
  declineCampaign,
};

export {
  actionTypes,
  actionCreators,
  initialState,
};

export default createReducer(initialState, actionHandlers);
