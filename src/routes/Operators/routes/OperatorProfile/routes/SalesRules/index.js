import { asyncRoute } from '../../../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OperatorSalesRules" */ './components/SalesRules'),
);
