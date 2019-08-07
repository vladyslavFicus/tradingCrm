import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "DesksListContainer" */ './containers/ListContainer'),
);
