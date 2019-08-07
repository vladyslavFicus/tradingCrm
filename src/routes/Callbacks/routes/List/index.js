import { asyncRoute } from '../../../../router/index';

export default asyncRoute(
  () => import(/* webpackChunkName: "CallbacksList" */ './components/CallbacksList'),
);
