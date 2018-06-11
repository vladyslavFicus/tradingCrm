import { asyncRoute } from '../../../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayerProfileGameActivityContainer" */ './containers/ViewContainer'),
  () => import(/* webpackChunkName: "PlayerProfileGameActivityReducers" */ './modules'),
  'userGamingActivity',
);
