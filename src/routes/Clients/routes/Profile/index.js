import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayerProfileContainer" */ './containers/ProfileContainer'),
);
