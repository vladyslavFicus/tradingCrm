import { asyncRoute } from '../../router';

export default asyncRoute(
  () => import(/* webpackChunkName: "SetPasswordContainer" */ './containers/SetPasswordContainer'),
  () => import(/* webpackChunkName: "SetPasswordReducer" */ './modules'),
  'passwordResetView',
);
