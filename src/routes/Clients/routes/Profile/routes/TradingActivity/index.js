import { asyncRoute } from 'router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayerProfileTradingActivityContainer" */ './containers/ViewContainer'),
);
