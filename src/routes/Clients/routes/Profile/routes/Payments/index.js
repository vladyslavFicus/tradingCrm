import { asyncRoute } from 'router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ProfileTransactionPaymentsContainer" */ './containers/ViewContainer'),
);
