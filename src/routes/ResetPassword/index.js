import { asyncRoute } from '../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "ResetPasswordContainer" */ './containers/ResetPasswordContainer'),
);
