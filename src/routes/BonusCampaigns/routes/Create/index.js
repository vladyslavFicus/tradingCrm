import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "BonusCampaignCreateContainer" */ './containers/CreateContainer'),
  () => import(/* webpackChunkName: "BonusCampaignCreateReducers" */ './modules'),
  'bonusCampaignCreate'

);
