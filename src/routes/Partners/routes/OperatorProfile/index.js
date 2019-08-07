import { asyncRoute } from '../../../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "OperatorProfileContainer" */ './containers/OperatorProfileContainer'),
  () => import(/* webpackChunkName: "OperatorProfileReducers" */ 'routes/Operators/routes/OperatorProfile/modules'),
  'operatorProfile',
);
