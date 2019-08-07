import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OperatorsListContainer" */ './containers/ListContainer'),
  () => import(/* webpackChunkName: "OperatorsListReducers" */ 'routes/Operators/routes/List/modules/list'),
  'operatorsList',
);
