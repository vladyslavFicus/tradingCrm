import { asyncRoute } from 'router';

export default asyncRoute(
  () => import(/* webpackChunkName: "PartnerProfileContainer" */ './containers/PartnerProfileContainer'),
);
