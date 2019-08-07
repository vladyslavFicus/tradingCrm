import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OfficesListContainer" */ './containers/ListContainer'),
);
