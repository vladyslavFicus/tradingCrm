import { CALL_API } from 'redux-api-middleware';
import { get } from 'lodash';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import {
  fulfillmentTypes,
  rewardTypes,
  countryStrategies,
} from '../../../../../constants/bonus-campaigns';
import { nodeGroupTypes } from '../constants';
import { nodeTypes as fulfillmentNodeTypes } from '../../../components/Settings/Fulfillments/constants';
import { nodeTypes as rewardNodeTypes } from '../../../components/Settings/Rewards/constants';
import deleteFromArray from '../../../../../utils/deleteFromArray';

const KEY = 'bonus-campaign/create';
const FETCH_CAMPAIGN = createRequestAction(`${KEY}/campaign-fetch`);
const REVERT = `${KEY}/revert-form`;
const REMOVE_NODE = `${KEY}/remove-node`;
const ADD_NODE = `${KEY}/add-fulfillment-node`;
const RESET_ALL_NODES = `${KEY}/reset-all-nodes`;
const CREATE_CAMPAIGN = createRequestAction(`${KEY}/create-campaign`);

function mapFulfillmentNode(fulfillmentType) {
  const node = null;

  if (fulfillmentType === fulfillmentTypes.PROFILE_COMPLETED) {
    return fulfillmentNodeTypes.profileCompleted;
  } else if (fulfillmentType === fulfillmentTypes.DEPOSIT) {
    return fulfillmentNodeTypes.deposit;
  } else if (fulfillmentType === fulfillmentTypes.WITHOUT_FULFILLMENT) {
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

function createCampaign(data) {
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

    const fulfillmentDeposit = get(endpointParams, 'fulfillments.deposit');
    if (fulfillmentDeposit) {
      endpointParams = {
        ...endpointParams,
        ...fulfillmentDeposit,
        fulfillmentType: fulfillmentTypes.DEPOSIT,
      };
    }

    const fulfillmentProfileCompleted = get(endpointParams, 'fulfillments.profileCompleted');
    if (fulfillmentProfileCompleted) {
      endpointParams = {
        ...endpointParams,
        fulfillmentType: fulfillmentTypes.PROFILE_COMPLETED,
      };
    }

    const fulfillmentNoFulfillments = get(endpointParams, 'fulfillments.noFulfillments');
    if (fulfillmentNoFulfillments) {
      endpointParams = {
        ...endpointParams,
        fulfillmentType: fulfillmentTypes.WITHOUT_FULFILLMENT,
      };
    }

    const rewardBonus = get(endpointParams, 'rewards.bonus');

    if (rewardBonus) {
      endpointParams = {
        ...endpointParams,
        ...rewardBonus,
        campaignRatio: {
          ...endpointParams.campaignRatio,
          ...rewardBonus.campaignRatio,
        },
        campaignType: rewardTypes.BONUS,
      };
    }

    const rewardFreeSpin = get(endpointParams, 'rewards.freeSpin');

    if (rewardFreeSpin) {
      endpointParams.campaignType = rewardTypes.FREE_SPIN;
      delete endpointParams.campaignRatio;
    }

    delete endpointParams.excludeCountries;
    delete endpointParams.fulfillments;
    delete endpointParams.rewards;

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

function resetAllNodes() {
  return {
    type: RESET_ALL_NODES,
  };
}

function addNode(nodeGroup, node) {
  return {
    type: ADD_NODE,
    nodeGroup,
    node,
  };
}

const initialNodeGroups = {
  [nodeGroupTypes.fulfillments]: [],
  [nodeGroupTypes.rewards]: [],
};

const initialState = {
  data: {},
  nodeGroups: { ...initialNodeGroups },
  error: null,
  isLoading: false,
  receivedAt: null,
};

const actionHandlers = {
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
      [nodeGroupTypes.fulfillments]: [mapFulfillmentNode(payload.fulfillmentType)],
      [nodeGroupTypes.rewards]: [mapRewardNode(payload.campaignType)],
    },
  }),
  [FETCH_CAMPAIGN.FAILURE]: (state, { error, meta: { endRequestTime } }) => ({
    ...state,
    error,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [REMOVE_NODE]: (state, action) => ({
    ...state,
    nodeGroups: {
      ...state.nodeGroups,
      [action.nodeGroup]: deleteFromArray(state.nodeGroups[action.nodeGroup], action.node),
    },
  }),
  [RESET_ALL_NODES]: state => ({
    ...state,
    nodeGroups: { ...initialNodeGroups },
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
      [nodeGroupTypes.fulfillments]: state.data.fulfillmentType ? [mapFulfillmentNode(state.data.fulfillmentType)] : [],
      [nodeGroupTypes.rewards]: state.data.campaignType ? [mapRewardNode(state.data.campaignType)] : [],
    },
  }),
};
const actionTypes = {
  FETCH_CAMPAIGN,
  REVERT,
  RESET_ALL_NODES,
};
const actionCreators = {
  createCampaign,
  revert,
  removeNode,
  addNode,
  resetAllNodes,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
