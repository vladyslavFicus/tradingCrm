import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayerProfileContainer" */ './containers/PlayerProfileContainer'),
  () => import(/* webpackChunkName: "PlayerProfileReducers" */ './modules'),
  'profile',
);
