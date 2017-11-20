import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import createReducer from '../../../../../utils/createReducer';
import timestamp from '../../../../../utils/timestamp';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actions, statusesReasons, campaignTypes } from '../../../../../constants/bonus-campaigns';
import buildFormData from '../../../../../utils/buildFormData';
import { nodeGroupTypes } from '../routes/Settings/constants';
import { nodeTypes as fulfillmentNodeTypes } from '../routes/Settings/components/Fulfillments/constants';
import { nodeTypes as rewardNodeTypes } from '../routes/Settings/components/Rewards/constants';
import deleteFromArray from '../../../../../utils/deleteFromArray';

const KEY = 'campaign';
const CAMPAIGN_UPDATE = createRequestAction(`${KEY}/campaign-update`);
const CAMPAIGN_CLONE = createRequestAction(`${KEY}/campaign-clone`);
const FETCH_CAMPAIGN = createRequestAction(`${KEY}/campaign-fetch`);
const CHANGE_CAMPAIGN_STATE = createRequestAction(`${KEY}/change-campaign-state`);
const UPLOAD_PLAYERS_FILE = createRequestAction(`${KEY}/upload-file`);
const REMOVE_PLAYERS = createRequestAction(`${KEY}/remove-players`);
const REVERT = createRequestAction(`${KEY}/revert-form`);
const REMOVE_FULFILLMENT_NODE = `${KEY}/remove-fulfillment-node`;
const ADD_FULFILLMENT_NODE = `${KEY}/add-fulfillment-node`;

function mapFulfillmentNode(campaignType) {
  const node = null;

  if (campaignType === campaignTypes.PROFILE_COMPLETED) {
    return fulfillmentNodeTypes.profileCompleted;
  } else if ([campaignTypes.DEPOSIT, campaignTypes.FIRST_DEPOSIT].indexOf(campaignType) > -1) {
    return fulfillmentNodeTypes.deposit;
  } else if (campaignType === campaignTypes.WITHOUT_FULFILMENT) {
    return fulfillmentNodeTypes.noFulfillments;
  }

  return node;
}

function fetchCampaign(uuid) {
  return (dispatch, getState) => {
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
          FETCH_CAMPAIGN.REQUEST,
          FETCH_CAMPAIGN.SUCCESS,
          FETCH_CAMPAIGN.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function activateCampaign(uuid) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    await dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${uuid}/activate`,
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

    return dispatch(fetchCampaign(uuid));
  };
}

function cancelCampaign(uuid, reason) {
  return async (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    await dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${uuid}/complete`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason,
          stateReason: statusesReasons.CANCELED,
        }),
        types: [
          CHANGE_CAMPAIGN_STATE.REQUEST,
          CHANGE_CAMPAIGN_STATE.SUCCESS,
          CHANGE_CAMPAIGN_STATE.FAILURE,
        ],
        bailout: !logged,
      },
    });

    return dispatch(fetchCampaign(uuid));
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

function updateCampaign(uuid, data) {
  return (dispatch, getState) => {
    const { token, uuid: currentUuid } = getState().auth;

    if (!token || !currentUuid) {
      return { type: false };
    }

    let endpointParams = {
      ...data,
      includeCountries: !data.excludeCountries,
    };
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

    const fulfillmentDeposit = _.get(endpointParams, 'fulfillments.deposit');
    if (fulfillmentDeposit) {
      endpointParams = {
        ...endpointParams,
        ...fulfillmentDeposit,
        campaignType: campaignTypes.DEPOSIT,
      };

      if (fulfillmentDeposit.firstDeposit) {
        endpointParams.campaignType = campaignTypes.FIRST_DEPOSIT;
      }
    }

    const fulfillmentProfileCompleted = _.get(endpointParams, 'fulfillments.profileCompleted');
    if (fulfillmentProfileCompleted) {
      endpointParams = {
        ...endpointParams,
        campaignType: campaignTypes.PROFILE_COMPLETED,
      };
    }

    const fulfillmentNoFulfillments = _.get(endpointParams, 'fulfillments.noFulfillments');
    if (fulfillmentNoFulfillments) {
      endpointParams = {
        ...endpointParams,
        campaignType: campaignTypes.WITHOUT_FULFILMENT,
      };
    }

    const rewardBonus = _.get(endpointParams, 'rewards.bonus');
    if (rewardBonus) {
      endpointParams = {
        ...endpointParams,
        ...rewardBonus,
      };
    }

    delete endpointParams.excludeCountries;
    delete endpointParams.firstDeposit;
    delete endpointParams.fulfillments;
    delete endpointParams.rewards;

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${uuid}`,
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

function uploadPlayersFile(uuid, file) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${uuid}/players-list`,
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

function cloneCampaign(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${uuid}/clone`,
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

function removeAllPlayers(uuid) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${uuid}/players-list`,
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

function revert() {
  return {
    type: REVERT,
  };
}

function removeNode(nodeGroup, node) {
  return {
    type: REMOVE_FULFILLMENT_NODE,
    nodeGroup,
    node,
  };
}

function addNode(nodeGroup, node) {
  return {
    type: ADD_FULFILLMENT_NODE,
    nodeGroup,
    node,
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
      excludeCountries: !action.payload.includeCountries,
    },
    nodeGroups: {
      ...state.nodeGroups,
      [nodeGroupTypes.fulfillments]: [mapFulfillmentNode(action.payload.campaignType)],
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
  [REMOVE_FULFILLMENT_NODE]: (state, action) => ({
    ...state,
    nodeGroups: {
      ...state.nodeGroups,
      [action.nodeGroup]: deleteFromArray(state.nodeGroups.fulfillments, action.node),
    },
  }),
  [ADD_FULFILLMENT_NODE]: (state, action) => ({
    ...state,
    nodeGroups: {
      ...state.nodeGroups,
      [action.nodeGroup]: [
        ...state.nodeGroups[action.nodeGroup],
        action.node,
      ],
    },
  }),
  [REVERT]: state => ({
    ...state,
    nodeGroups: {
      ...state.nodeGroups,
      [nodeGroupTypes.fulfillments]: [mapFulfillmentNode(state.data.campaignType)],
    },
  }),
};
const initialState = {
  data: {},
  nodeGroups: {
    [nodeGroupTypes.fulfillments]: [],
    [nodeGroupTypes.rewards]: [rewardNodeTypes.bonus],
  },
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
  REVERT,
};
const actionCreators = {
  fetchCampaign,
  updateCampaign,
  changeCampaignState,
  uploadPlayersFile,
  cloneCampaign,
  removeAllPlayers,
  revert,
  removeNode,
  addNode,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
