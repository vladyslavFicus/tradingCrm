import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import { sourceActionCreators } from '../../../../../../../redux/modules/bonusCampaigns';
import {
  statuses as bonusCampaignStatuses,
  targetTypes as campaignTargetTypes,
} from '../../../../../../../constants/bonus-campaigns';

const KEY = 'player/bonus-campaign/campaigns';
const FETCH_CAMPAIGNS = createRequestAction(`${KEY}/fetch-campaigns`);
const ADD_PLAYER_TO_CAMPAIGN = createRequestAction(`${KEY}/add-player-to-campaign`);
const ADD_PROMO_CODE_TO_PLAYER = createRequestAction(`${KEY}/add-promo-code-to-player`);
const DECLINE_CAMPAIGN = createRequestAction(`${KEY}/decline-campaign`);
const OPT_IN_CAMPAIGN = createRequestAction(`${KEY}/opt-in-campaign`);

const fetchCampaigns = (filters = {}) => sourceActionCreators.fetchCampaigns(FETCH_CAMPAIGNS)({
  ...filters,
  size: 99999,
  state: [bonusCampaignStatuses.PENDING, bonusCampaignStatuses.ACTIVE],
  targetType: campaignTargetTypes.TARGET_LIST,
});

function addPlayerToCampaign(uuid, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${uuid}/players-list/${playerUUID}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          ADD_PLAYER_TO_CAMPAIGN.REQUEST,
          ADD_PLAYER_TO_CAMPAIGN.SUCCESS,
          ADD_PLAYER_TO_CAMPAIGN.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

function addPromoCodeToPlayer(playerUUID, promoCode) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${playerUUID}/by-promo-code/${promoCode}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          ADD_PROMO_CODE_TO_PLAYER.REQUEST,
          ADD_PROMO_CODE_TO_PLAYER.SUCCESS,
          ADD_PROMO_CODE_TO_PLAYER.FAILURE,
        ],
        bailout: !logged,
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

function optInCampaign(id, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `/promotion/campaigns/${id}/optin/${playerUUID}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [OPT_IN_CAMPAIGN.REQUEST, OPT_IN_CAMPAIGN.SUCCESS, OPT_IN_CAMPAIGN.FAILURE],
        bailout: !logged,
      },
    });
  };
}

const actionTypes = {
  FETCH_CAMPAIGNS,
  ADD_PLAYER_TO_CAMPAIGN,
  DECLINE_CAMPAIGN,
};
const actionCreators = {
  fetchCampaigns,
  addPlayerToCampaign,
  addPromoCodeToPlayer,
  declineCampaign,
  optInCampaign,
};

export {
  actionTypes,
  actionCreators,
};
