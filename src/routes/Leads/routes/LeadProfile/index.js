import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "LeadProfileContainer" */ './containers/LeadProfileContainer'),
);
