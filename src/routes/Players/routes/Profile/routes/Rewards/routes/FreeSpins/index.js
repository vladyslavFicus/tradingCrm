import { asyncRoute } from '../../../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileRewardsFreeSpinsContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "ProfileRewardsFreeSpinsReducers" */ './modules'),
  'userBonusFreeSpinsList',
);

