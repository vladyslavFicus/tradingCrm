import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayersListContainer" */ './containers/ListContainer'),
  () => import(/* webpackChunkName: "PlayersListReducer" */ './modules/list'),
  'usersList',
);
