import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "LeadsListContainer" */ './containers/ListContainer'),
);
