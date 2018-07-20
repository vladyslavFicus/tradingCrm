import { asyncRoute } from '../../../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileRewardsCampaignsContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileRewardsCampaignsReducers" */ './modules'),
  'playerBonusCampaignsList',
);
