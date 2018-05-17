import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "CampaignListContainer" */ './containers/ListContainer'),
  () => import(/* webpackChunkName: "CampaignListReducers" */ './modules'),
  'bonusCampaigns'
);
