import { asyncRoute } from '../../../../router/index';

export default asyncRoute(
  () => import(/* webpackChunkName: "CallbacksListContainer" */ './container/CallbacksListContainer')
);
