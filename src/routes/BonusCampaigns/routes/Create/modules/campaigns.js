import createRequestAction from '../../../../../utils/createRequestAction';
import { sourceActionCreators } from '../../../../../redux/modules/campaigns';
import {
  statuses as bonusCampaignStatuses,
} from '../../../../../constants/bonus-campaigns';

const KEY = 'bonus-campaign/create/campaigns';
const FETCH_CAMPAIGNS = createRequestAction(`${KEY}/fetch-campaigns`);
const FETCH_CAMPAIGN = createRequestAction(`${KEY}/fetch-campaign`);
const fetchCampaigns = (filters = {}) => sourceActionCreators.fetchCampaigns(FETCH_CAMPAIGNS)({
  ...filters,
  size: 99999,
  state: [bonusCampaignStatuses.ACTIVE, bonusCampaignStatuses.PENDING, bonusCampaignStatuses.DRAFT],
});

const fetchCampaign = sourceActionCreators.fetchCampaign(FETCH_CAMPAIGN);

const actionTypes = {
  FETCH_CAMPAIGNS,
};

const actionCreators = {
  fetchCampaigns,
  fetchCampaign,
};

export {
  actionTypes,
  actionCreators,
};
