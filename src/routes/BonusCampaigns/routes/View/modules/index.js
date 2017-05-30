import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';

const KEY = 'campaign';
const CAMPAIGN_UPDATE = createRequestAction(`${KEY}/campaign-update`);
const FETCH_CAMPAIGN = createRequestAction(`${KEY}/campaign-fetch`);

function fetchCampaign(id) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${id}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_CAMPAIGN.REQUEST,
          FETCH_CAMPAIGN.SUCCESS,
          FETCH_CAMPAIGN.FAILURE,
        ],
        bailout: !logged,
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
      [CALL_API]: {
        endpoint: `promotion/campaigns/${id}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          {
            type: CAMPAIGN_UPDATE.REQUEST,
            meta: { data },
          },
          CAMPAIGN_UPDATE.SUCCESS,
          CAMPAIGN_UPDATE.FAILURE,
        ],
      },
    });
  };
}

const actionHandlers = {
  [CAMPAIGN_UPDATE.REQUEST]: (state, action) => ({
    ...state,
    error: null,
    data: {
      ...state.data,
      ...action.meta.data,
    },
    isLoading: true,
  }),
  [CAMPAIGN_UPDATE.SUCCESS]: state => ({
    ...state,
    isLoading: false,
    receivedAt: timestamp(),
  }),
  [CAMPAIGN_UPDATE.FAILURE]: (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false,
    receivedAt: timestamp(),
  }),

  [FETCH_CAMPAIGN.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_CAMPAIGN.SUCCESS]: (state, action) => ({
    ...state,
    receivedAt: timestamp(),
    isLoading: false,
    data: {
      ...state.data,
      ...action.payload,
    },
  }),
  [FETCH_CAMPAIGN.FAILURE]: (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false,
    receivedAt: timestamp(),
  }),
};
const initialState = {
  data: {},
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionTypes = {
  CAMPAIGN_UPDATE,
  FETCH_CAMPAIGN,
};
const actionCreators = {
  fetchCampaign,
  updateCampaign,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
