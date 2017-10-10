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
const fetchCampaigns = (filters = {}) => sourceActionCreators.fetchCampaigns(FETCH_CAMPAIGNS)({
  ...filters,
  size: 99999,
  state: [bonusCampaignStatuses.PENDING, bonusCampaignStatuses.ACTIVE],
  targetType: campaignTargetTypes.TARGET_LIST,
});

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
