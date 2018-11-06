import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "TransactionsListContainer" */ './container/TransactionsListContainer'),
  () => import(/* webpackChunkName: "TransactionsListReducer" */ './modules'),
  'transactions'
);
