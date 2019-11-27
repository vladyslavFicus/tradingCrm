import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PlayersListContainer" */ './containers/ListContainer'),
);
