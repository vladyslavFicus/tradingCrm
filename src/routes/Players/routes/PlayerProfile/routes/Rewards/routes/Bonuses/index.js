import { asyncRoute } from '../../../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileRewardsBonusesContainer" */ './containers/BonusesContainer'),
  () => import(/* webpackChunkName: "ProfileRewardsBonusesReducers" */ './modules'),
  'userBonusesList',
);
