import { CALL_API } from 'redux-api-middleware';
import _ from 'lodash';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import {
  actions,
  statusesReasons,
  fulfilmentTypes,
  rewardTypes,
  countryStrategies,
} from '../../../../../constants/bonus-campaigns';
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
const REMOVE_NODE = `${KEY}/remove-node`;
const ADD_NODE = `${KEY}/add-fulfillment-node`;

function mapFulfillmentNode(fulfilmentType) {
  const node = null;

  if (fulfilmentType === fulfilmentTypes.PROFILE_COMPLETED) {
    return fulfillmentNodeTypes.profileCompleted;
  } else if ([fulfilmentTypes.DEPOSIT, fulfilmentTypes.FIRST_DEPOSIT].indexOf(fulfilmentType) > -1) {
    return fulfillmentNodeTypes.deposit;
  } else if (fulfilmentType === fulfilmentTypes.WITHOUT_FULFILMENT) {
    return fulfillmentNodeTypes.noFulfillments;
  }

  return node;
}

function mapRewardNode(campaignType) {
  const node = null;

  if (campaignType === rewardTypes.FREE_SPIN) {
    return rewardNodeTypes.freeSpin;
  } if (campaignType === rewardTypes.BONUS) {
    return rewardNodeTypes.bonus;
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
      countryStrategy: data.excludeCountries ? countryStrategies.EXCLUDE : countryStrategies.INCLUDE,
    };
    if (endpointParams.conversionPrize && !endpointParams.conversionPrize.value) {
      endpointParams.conversionPrize = null;
    }
    if (endpointParams.capping && !endpointParams.capping.value) {
      endpointParams.capping = null;
    }

    const fulfillmentDeposit = _.get(endpointParams, 'fulfillments.deposit');
    if (fulfillmentDeposit) {
      endpointParams = {
        ...endpointParams,
        ...fulfillmentDeposit,
        fulfilmentType: fulfilmentTypes.DEPOSIT,
      };

      if (fulfillmentDeposit.firstDeposit) {
        endpointParams.fulfilmentType = fulfilmentTypes.FIRST_DEPOSIT;
      }
    }

    const fulfillmentProfileCompleted = _.get(endpointParams, 'fulfillments.profileCompleted');
    if (fulfillmentProfileCompleted) {
      endpointParams = {
        ...endpointParams,
        fulfilmentType: fulfilmentTypes.PROFILE_COMPLETED,
      };
    }

    const fulfillmentNoFulfillments = _.get(endpointParams, 'fulfillments.noFulfillments');
    if (fulfillmentNoFulfillments) {
      endpointParams = {
        ...endpointParams,
        fulfilmentType: fulfilmentTypes.WITHOUT_FULFILMENT,
      };
    }

    const rewardBonus = _.get(endpointParams, 'rewards.bonus');
    if (rewardBonus) {
      endpointParams = {
        ...endpointParams,
        ...rewardBonus,
        campaignType: 'BONUS',
      };
    }

    const rewardFreeSpin = _.get(endpointParams, 'rewards.freeSpin');
    if (rewardFreeSpin) {
      endpointParams.campaignType = 'FREE_SPIN';
      delete endpointParams.campaignRatio;
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
          CAMPAIGN_UPDATE.SUCCESS,
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
    type: REMOVE_NODE,
    nodeGroup,
    node,
  };
}

function addNode(nodeGroup, node) {
  return {
    type: ADD_NODE,
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
  [CAMPAIGN_UPDATE.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: { ...state.data, ...payload },
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [CAMPAIGN_UPDATE.FAILURE]: (state, { error, meta: { endRequestTime } }) => ({
    ...state,
    error,
    isLoading: false,
    receivedAt: endRequestTime,
  }),

  [FETCH_CAMPAIGN.REQUEST]: state => ({
    ...state,
    error: null,
    isLoading: true,
  }),
  [FETCH_CAMPAIGN.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    receivedAt: endRequestTime,
    isLoading: false,
    data: {
      ...state.data,
      ...payload,
      excludeCountries: payload.countryStrategy === countryStrategies.EXCLUDE,
    },
    nodeGroups: {
      ...state.nodeGroups,
      [nodeGroupTypes.fulfillments]: [mapFulfillmentNode(payload.fulfilmentType)],
      [nodeGroupTypes.rewards]: [mapRewardNode(payload.campaignType)],
    },
  }),
  [FETCH_CAMPAIGN.FAILURE]: (state, { error, meta: { endRequestTime } }) => ({
    ...state,
    error,
    isLoading: false,
    receivedAt: endRequestTime,
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
  [REMOVE_NODE]: (state, action) => ({
    ...state,
    nodeGroups: {
      ...state.nodeGroups,
      [action.nodeGroup]: deleteFromArray(state.nodeGroups[action.nodeGroup], action.node),
    },
  }),
  [ADD_NODE]: (state, action) => ({
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
      [nodeGroupTypes.fulfillments]: [mapFulfillmentNode(state.data.fulfilmentType)],
      [nodeGroupTypes.rewards]: [mapRewardNode(state.data.campaignType)],
    },
  }),
};
const initialState = {
  data: {},
  nodeGroups: {
    [nodeGroupTypes.fulfillments]: [],
    [nodeGroupTypes.rewards]: [],
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
