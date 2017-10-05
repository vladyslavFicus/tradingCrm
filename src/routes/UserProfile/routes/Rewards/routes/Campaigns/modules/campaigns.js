import { CALL_API } from 'redux-api-middleware';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import { sourceActionCreators } from '../../../../../../../redux/modules/bonusCampaigns';

const KEY = 'player/bonus-campaign/campaigns';
const FETCH_CAMPAIGNS = createRequestAction(`${KEY}/fetch-campaigns`);
const ADD_PLAYER_TO_CAMPAIGN = createRequestAction(`${KEY}/add-player-to-campaign`);
const fetchCampaigns = sourceActionCreators.fetchCampaigns(FETCH_CAMPAIGNS);

function addPlayerToCampaign(campaignId, playerUUID) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `promotion/campaigns/${campaignId}/players-list/${playerUUID}`,
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

const actionTypes = {
  FETCH_CAMPAIGNS,
  ADD_PLAYER_TO_CAMPAIGN,
};
const actionCreators = {
  fetchCampaigns,
  addPlayerToCampaign,
};

export {
  actionTypes,
  actionCreators,
};
