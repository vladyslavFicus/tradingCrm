import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../../../../../utils/createRequestAction';
import buildQueryString from '../../../../../../../../../utils/buildQueryString';

const KEY = 'player/bonus-campaign/campaigns';
const FETCH_CAMPAIGNS = createRequestAction(`${KEY}/fetch-campaigns`);
const ADD_PROMO_CODE_TO_PLAYER = createRequestAction(`${KEY}/add-promo-code-to-player`);
const OPT_IN_CAMPAIGN = createRequestAction(`${KEY}/opt-in-campaign`);
const OPT_OUT_CAMPAIGN = createRequestAction(`${KEY}/opt-out-campaign`);
const ADD_PLAYER_TO_CAMPAIGN = createRequestAction(`${KEY}/add-player-to-campaign`);
const DELETE_PLAYER_FROM_CAMPAIGN = createRequestAction(`${KEY}/delete-player-from-campaign`);

function fetchCampaigns(playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `campaign_aggregator/accessible/${playerUUID}?${buildQueryString({ size: 99999 })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          FETCH_CAMPAIGNS.REQUEST,
          FETCH_CAMPAIGNS.SUCCESS,
          FETCH_CAMPAIGNS.FAILURE,
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
        endpoint: `campaign_aggregator/players/${playerUUID}/promo-codes/${promoCode}`,
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

function optInCampaign({ uuid, sourceType, playerUUID }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `campaign_aggregator/${sourceType.toLowerCase()}/${uuid}/optin/${playerUUID}`,
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

function optOutCampaign({ uuid, sourceType, playerUUID, returnToList = false }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();
    const optoutType = returnToList ? 'RETURN_TO_LIST' : 'IGNORE_CAMPAIGN';

    return dispatch({
      [CALL_API]: {
        endpoint: `campaign_aggregator/${sourceType.toLowerCase()}/${uuid}/optout/${playerUUID}?optoutType=${optoutType}`,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [OPT_OUT_CAMPAIGN.REQUEST, OPT_OUT_CAMPAIGN.SUCCESS, OPT_OUT_CAMPAIGN.FAILURE],
        bailout: !logged,
      },
    });
  };
}

function addPlayerToCampaign({ uuid, sourceType, playerUUID }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `campaign_aggregator/${sourceType.toLowerCase()}/${uuid}/players/${playerUUID}`,
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

function deletePlayerFromCampaign({ uuid, sourceType, playerUUID }) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `campaign_aggregator/${sourceType.toLowerCase()}/${uuid}/players/${playerUUID}`,
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          DELETE_PLAYER_FROM_CAMPAIGN.REQUEST,
          DELETE_PLAYER_FROM_CAMPAIGN.SUCCESS,
          DELETE_PLAYER_FROM_CAMPAIGN.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const actionTypes = {
  FETCH_CAMPAIGNS,
  OPT_IN_CAMPAIGN,
  OPT_OUT_CAMPAIGN,
  ADD_PLAYER_TO_CAMPAIGN,
  DELETE_PLAYER_FROM_CAMPAIGN,
};
const actionCreators = {
  fetchCampaigns,
  addPlayerToCampaign,
  addPromoCodeToPlayer,
  optInCampaign,
  optOutCampaign,
  deletePlayerFromCampaign,
};

export {
  actionTypes,
  actionCreators,
};
