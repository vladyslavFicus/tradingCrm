import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ReportListContainer" */ './container/ReportListContainer')
);
