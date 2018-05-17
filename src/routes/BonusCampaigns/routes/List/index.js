import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "BonusCampaignListContainer" */ './containers/ListContainer'),
  () => import(/* webpackChunkName: "BonusCampaignListReducers" */ './modules'),
  'bonusCampaigns'
);
