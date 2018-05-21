import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileRewardsContainer" */ './containers/RewardsContainer'),
  () => import(/* webpackChunkName: "ProfileRewardsReducers" */ '../../modules/subtabs'),
  'userRewardsSubTabs',
);
