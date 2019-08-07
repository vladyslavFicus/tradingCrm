import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "TeamsListContainer" */ './containers/ListContainer'),
);
