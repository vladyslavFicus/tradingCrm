import { WEB_API, ContentType } from 'constants/index';
import { getTimestamp, localDateToString } from 'utils/helpers';
import { createRequestTypes } from 'utils/redux';

const KEY = 'campaign';
const CAMPAIGN_UPDATE = createRequestTypes(`${KEY}/campaign-update`);
const FETCH_CAMPAIGN = createRequestTypes(`${KEY}/campaign-fetch`);

function fetchCampaign(id) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'GET',
        types: [FETCH_CAMPAIGN.REQUEST, FETCH_CAMPAIGN.SUCCESS, FETCH_CAMPAIGN.FAILURE],
        endpoint: `promotion/campaigns/${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });
  };
}

function updateCampaign(id, data) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    return dispatch({
      [WEB_API]: {
        method: 'PUT',
        types: [CAMPAIGN_UPDATE.REQUEST, CAMPAIGN_UPDATE.SUCCESS, CAMPAIGN_UPDATE.FAILURE],
        endpoint: `promotion/campaigns/${id}`,
        endpointParams: data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      data,
    });
  };
}

const actionHandlers = {
  [CAMPAIGN_UPDATE.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    data: { ...state.data, ...action.data },
    isLoading: true,
    isFailed: false,
  }),
  [CAMPAIGN_UPDATE.SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    receivedAt: getTimestamp(),
  }),
  [CAMPAIGN_UPDATE.FAILURE]: (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),

  [FETCH_CAMPAIGN.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    isLoading: true,
    isFailed: false,
  }),
  [FETCH_CAMPAIGN.SUCCESS]: (state, action) => ({
    ...state,
    data: { ...state.data, ...action.response },
  }),
  [FETCH_CAMPAIGN.FAILURE]: (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false,
    isFailed: true,
    receivedAt: getTimestamp(),
  }),
};

const initialState = {
  data: {},
  error: null,
  isLoading: false,
  isFailed: false,
  receivedAt: null,
};
function reducer(state = initialState, action) {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {
  CAMPAIGN_UPDATE,
  FETCH_CAMPAIGN,
};

const actionCreators = {
  fetchCampaign,
  updateCampaign,
};

export {
  actionTypes,
  actionCreators,
};

export default reducer;
