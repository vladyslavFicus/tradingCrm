import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OfficeProfileContainer" */ './containers/OfficeProfileContainer'),
);
