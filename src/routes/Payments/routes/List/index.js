import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "TransactionsListContainer" */ './container/TransactionsListContainer'),
);
