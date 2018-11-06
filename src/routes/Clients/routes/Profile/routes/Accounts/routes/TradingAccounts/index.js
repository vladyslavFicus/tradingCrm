import { asyncRoute } from '../../../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayerProfileTradingAccountsContainer" */ './containers/ViewContainer'),
);
