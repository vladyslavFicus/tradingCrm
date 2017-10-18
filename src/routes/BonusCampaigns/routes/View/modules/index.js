import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actions, statusesReasons } from '../../../../../constants/bonus-campaigns';
import buildFormData from '../../../../../utils/buildFormData';

const KEY = 'campaign';
const CAMPAIGN_UPDATE = createRequestAction(`${KEY}/campaign-update`);
const CAMPAIGN_CLONE = createRequestAction(`${KEY}/campaign-clone`);
const FETCH_CAMPAIGN = createRequestAction(`${KEY}/campaign-fetch`);
const CHANGE_CAMPAIGN_STATE = createRequestAction(`${KEY}/change-campaign-state`);
const UPLOAD_PLAYERS_FILE = createRequestAction(`${KEY}/upload-file`);
const REMOVE_PLAYERS = createRequestAction(`${KEY}/remove-players`);

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

function activateCampaign(id) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    await dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${id}/activate`,
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

    return dispatch(fetchCampaign(id));
  };
}

function cancelCampaign(id, reason) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    await dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${id}/complete`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, stateReason: statusesReasons.CANCELED }),
        types: [
          CHANGE_CAMPAIGN_STATE.REQUEST,
          CHANGE_CAMPAIGN_STATE.SUCCESS,
          CHANGE_CAMPAIGN_STATE.FAILURE,
        ],
        bailout: !logged,
      },
    });

    return dispatch(fetchCampaign(id));
  };
}

function changeCampaignState({ id, action, reason }) {
  return async (dispatch) => {
    if (action === actions.ACTIVATE) {
      return dispatch(activateCampaign(id));
    } else if (action === actions.CANCEL) {
      return dispatch(cancelCampaign(id, reason));
    }

    throw new Error(`Unknown status change action "${action}"`);
  };
}

function updateCampaign(id, data) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    const endpointParams = { ...data };
    if (
      endpointParams.conversionPrize &&
      (endpointParams.conversionPrize.value === undefined || endpointParams.conversionPrize.value === null)
    ) {
      endpointParams.conversionPrize = null;
    }
    if (
      endpointParams.capping &&
      (endpointParams.capping.value === undefined || endpointParams.capping.value === null)
    ) {
      endpointParams.capping = null;
    }

    endpointParams.includeCountries = !endpointParams.excludeCountries;
    delete endpointParams.excludeCountries;

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${id}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(endpointParams),
        types: [
          CAMPAIGN_UPDATE.REQUEST,
          { type: CAMPAIGN_UPDATE.SUCCESS, payload: data },
          CAMPAIGN_UPDATE.FAILURE,
        ],
      },
    });
  };
}

function uploadPlayersFile(bonusCampaignId, file) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${bonusCampaignId}/players-list`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: buildFormData({ file }),
        types: [
          {
            type: UPLOAD_PLAYERS_FILE.REQUEST,
            payload: { file },
          },
          UPLOAD_PLAYERS_FILE.SUCCESS,
          UPLOAD_PLAYERS_FILE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function cloneCampaign(campaignId) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${campaignId}/clone`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          CAMPAIGN_CLONE.REQUEST,
          CAMPAIGN_CLONE.SUCCESS,
          CAMPAIGN_CLONE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function removeAllPlayers(campaignId) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${campaignId}/players-list`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          REMOVE_PLAYERS.REQUEST,
          REMOVE_PLAYERS.SUCCESS,
          REMOVE_PLAYERS.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionHandlers = {
  [CAMPAIGN_UPDATE.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [CAMPAIGN_UPDATE.SUCCESS]: (state, action) => ({
    ...state,
    data: { ...state.data, ...action.payload },
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
  [UPLOAD_PLAYERS_FILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      totalSelectedPlayers: action.payload.playersCount,
    },
  }),
  [REMOVE_PLAYERS.SUCCESS]: state => ({
    ...state,
    data: {
      ...state.data,
      totalSelectedPlayers: 0,
    },
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
  CHANGE_CAMPAIGN_STATE,
  CAMPAIGN_CLONE,
  REMOVE_PLAYERS,
};
const actionCreators = {
  fetchCampaign,
  updateCampaign,
  changeCampaignState,
  uploadPlayersFile,
  cloneCampaign,
  removeAllPlayers,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
