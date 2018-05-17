import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "BonusCampaignViewContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "BonusCampaignViewReducers" */ './modules'),
  'bonusCampaignView'
);
