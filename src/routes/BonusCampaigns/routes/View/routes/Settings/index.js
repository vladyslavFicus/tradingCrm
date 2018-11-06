import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "BonusCampaignSettingsViewContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "BonusCampaignSettingsViewReducers" */ './modules'),
  'bonusCampaignSettings'
);
