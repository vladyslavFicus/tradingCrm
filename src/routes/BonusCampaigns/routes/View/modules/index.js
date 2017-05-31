import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actions, statusesReasons } from '../../../constants';
import buildFormData from '../../../../../utils/buildFormData';

const KEY = 'campaign';
const CAMPAIGN_UPDATE = createRequestAction(`${KEY}/campaign-update`);
const FETCH_CAMPAIGN = createRequestAction(`${KEY}/campaign-fetch`);
const CHANGE_CAMPAIGN_STATE = createRequestAction(`${KEY}/change-campaign-state`);
const UPLOAD_PLAYERS_FILE = createRequestAction(`${KEY}/upload-file`);

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

function changeCampaignState({ id, action, reason }) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();
    let endpoint = '';
    const params = { reason };

    if (action === actions.ACTIVATE) {
      endpoint = `promotion/campaigns/${id}/activate`;
    } else if (action === actions.CANCEL) {
      endpoint = `promotion/campaigns/${id}/complete`;
      params.stateReason = statusesReasons.CANCELED;
    }

    if (!endpoint) {
      return null;
    }

    await dispatch({
      [CALL_API]: {
        endpoint,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
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
  [UPLOAD_PLAYERS_FILE.SUCCESS]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      totalSelectedPlayers: action.payload.playersCount,
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
};
const actionCreators = {
  fetchCampaign,
  updateCampaign,
  changeCampaignState,
  uploadPlayersFile,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
